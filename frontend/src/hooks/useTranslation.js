import { useState, useCallback } from 'react';
import axios from 'axios';

function useTranslation() {
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokenCount, setTokenCount] = useState(0);

    const handleTranslate = useCallback(async (text, settings) => {
        if (!text.trim()) {
            return;
        }

        setLoading(true);
        setError(null);
        setTranslatedText('');
        setTokenCount(0);

        const apiKeys = [settings.apiKey, settings.backupApiKey1, settings.backupApiKey2].filter(key => key.trim() !== '');
        if (apiKeys.length === 0) {
            setError('유효한 API 키가 없습니다. 설정을 확인해 주세요.');
            setLoading(false);
            return;
        }

        let translationSuccess = false;
        let lastError = null;

        for (const key of apiKeys) {
            try {
                // API 키와 모델 설정은 번역 요청 본문에 포함하여 백엔드로 보냅니다.
                const response = await axios.post('http://localhost:5000/api/translate', {
                    text: text,
                    temperature: parseFloat(settings.temperature),
                    topP: parseFloat(settings.topP),
                    customPrompt: settings.customPrompt,
                    translationNotes: settings.translationNotes,
                    apiKey: key,
                });

                setTranslatedText(response.data.translation);
                setTokenCount(response.data.tokenCount);
                translationSuccess = true;
                break;
            } catch (err) {
                console.error(`번역 오류 (API Key: ${key}):`, err);
                lastError = err;
            }
        }

        if (!translationSuccess && lastError) {
            // API 오류 코드를 기반으로 사용자 친화적인 메시지를 생성합니다.
            if (lastError.response?.status === 400 && lastError.response?.data?.message.includes('API key expired')) {
                setError('사용하고 계신 Gemini API 키가 더 이상 유효하지 않습니다. API 서버가 요청을 거부하고 있습니다. 설정에서 새 키를 발급받아 주세요.');
            } else if (lastError.response?.status === 429) {
                setError('Gemini API의 일일 무료 사용량(50회)을 초과했습니다. 내일 다시 시도하거나 다른 API 키를 사용해주세요.');
            } else {
                setError(lastError.response?.data?.message || '번역에 실패했습니다.');
            }
        }
        setLoading(false);
    }, []);

    return { translatedText, loading, error, tokenCount, handleTranslate };
}

export default useTranslation;