// backend/routes/translate.js

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const router = express.Router();
const { defaultPrompt } = require('../prompts'); // <-- 이 경로를 수정했습니다.

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (e) {
        return false;
    }
}

// 이 함수는 HTML에서 불필요한 요소를 제거합니다.
const removeUnwantedElements = ($) => {
    // 흔히 광고, 메뉴, 푸터 등이 포함되는 태그를 선택적으로 제거합니다.
    $('header, footer, nav, aside, .ad, .advertisement, #sidebar').remove();
};

// 이 함수는 HTML에서 텍스트 노드를 찾아 번역하고 다시 삽입합니다.
const translateHtml = async ($, model, customPrompt, translationNotes) => {
    const textNodes = [];
    const nodeMap = new Map();
    let counter = 0;

    // HTML의 모든 텍스트 노드를 찾아 고유한 ID를 부여합니다.
    $('*').each((i, el) => {
        $(el).contents().filter(function () {
            return this.type === 'text' && $(this).text().trim().length > 0;
        }).each((j, node) => {
            const originalText = $(node).text();
            const placeholder = `[[TEXT_${counter++}]]`;
            nodeMap.set(placeholder, originalText);
            $(node).replaceWith(placeholder);
        });
    });

    // 모든 텍스트 노드를 한 번에 번역하도록 프롬프트 구성
    const textToTranslate = Array.from(nodeMap.entries()).map(([placeholder, text]) => `${placeholder}: ${text}`).join('\n');
    const finalPrompt = `${defaultPrompt} ${customPrompt} ${translationNotes}\n\n${textToTranslate}`;

    // Gemini API에 한 번에 번역을 요청합니다.
    const result = await model.generateContent(finalPrompt);
    const translatedText = result.response.text();

    // 번역 결과를 파싱하여 HTML에 다시 삽입합니다.
    let translatedHtml = $.html();
    for (const [placeholder, _] of nodeMap.entries()) {
        const translatedChunk = translatedText.match(new RegExp(`${placeholder}: (.*?)(?=${placeholder.replace('TEXT', 'TEXT')}:|$)`, 's'));
        if (translatedChunk && translatedChunk[1]) {
            translatedHtml = translatedHtml.replace(placeholder, translatedChunk[1].trim());
        } else {
            translatedHtml = translatedHtml.replace(placeholder, nodeMap.get(placeholder));
        }
    }

    return translatedHtml;
};

router.post('/', async (req, res) => {
    const { text, temperature, topP, apiKey, customPrompt, translationNotes } = req.body;
    const modelName = 'gemini-1.5-flash';
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    if (!text || !apiKey) {
        return res.status(400).json({ message: '필수 매개변수가 누락되었습니다.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const selectedModel = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { temperature, topP },
            safetySettings,
        });

        if (isValidUrl(text)) {
            try {
                const urlResponse = await axios.get(text);
                const $ = cheerio.load(urlResponse.data);

                removeUnwantedElements($);

                const translatedHtml = await translateHtml($, selectedModel, customPrompt, translationNotes);

                return res.json({ translation: translatedHtml });
            } catch (err) {
                console.error('URL 콘텐츠 처리 오류:', err);
                return res.status(500).json({ message: 'URL 콘텐츠를 처리하는 데 실패했습니다.' });
            }
        } else {
            const finalPrompt = `${defaultPrompt} ${customPrompt} ${translationNotes} "${text}"`;
            const { totalTokens } = await selectedModel.countTokens(finalPrompt);
            const result = await selectedModel.generateContent(finalPrompt);
            const response = await result.response;
            res.json({ translation: response.text(), tokenCount: totalTokens });
        }
    } catch (err) {
        console.error('번역 오류:', err.message);
        res.status(500).json({ message: '번역에 실패했습니다.' });
    }
});

module.exports = router;