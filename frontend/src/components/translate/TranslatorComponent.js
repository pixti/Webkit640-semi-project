import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';
import useSettings from '../../hooks/useSettings';
import ThemeSettings from './ThemeSettings';
import ApiAndModelSettings from './ApiAndModelSettings';
import PromptSettings from './PromptSettings';

function TranslatorComponent() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPromptSettingsOpen, setIsPromptSettingsOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isUrl, setIsUrl] = useState(false); // URL 입력 상태를 추가합니다.

    const { settings, setSettings, handleSaveSettings, fetchUserSettings, isLoggedIn, defaultSettings } = useSettings();
    const { translatedText, loading, error, tokenCount, handleTranslate } = useTranslation();

    // URL 유효성 검사 함수 추가
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleTextInput = (e) => {
        const inputText = e.target.value;
        setText(inputText);
        setIsUrl(isValidUrl(inputText)); // 입력된 텍스트가 URL인지 확인
    };

    const handleCreatePost = () => {
        if (!text || !translatedText) {
            alert('번역할 내용이 없거나 번역 결과가 없습니다.');
            return;
        }
        const now = new Date();
        const formattedDate = now.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
        const formattedTime = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const initialTitle = `AI 번역 공유 ${formattedDate} ${formattedTime}`;

        navigate('/create-post', {
            state: {
                initialTitle: initialTitle,
                initialContent: `--- 번역할 텍스트 ---\n${text}\n\n--- 번역 결과 ---\n${translatedText}`
            }
        });
    };

    const handlePanelToggle = (panel) => {
        setIsSettingsOpen(panel === 'settings' ? !isSettingsOpen : false);
        setIsPromptSettingsOpen(panel === 'prompt' ? !isPromptSettingsOpen : false);
        setIsThemeOpen(panel === 'theme' ? !isThemeOpen : false);
    };

    return (
        <div className="container-lg my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <span role="img" aria-label="sparkles" style={{ marginRight: '8px' }}>✨</span> AI 번역기
                    </h5>
                    <div className="d-flex">
                        {isLoggedIn && (
                            <button className="btn btn-danger btn-sm me-2" onClick={fetchUserSettings}>
                                <i className="bi bi-arrow-clockwise me-1"></i>설정 불러오기
                            </button>
                        )}
                        <button className="btn btn-outline-light btn-sm me-2" onClick={() => handlePanelToggle('theme')}>
                            테마 {isThemeOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                        </button>
                        <button className="btn btn-outline-light btn-sm me-2" onClick={() => handlePanelToggle('prompt')}>
                            프롬포트 {isPromptSettingsOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                        </button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => handlePanelToggle('settings')}>
                            API 및 모델 설정 {isSettingsOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                        </button>
                    </div>
                </div>

                {isThemeOpen && (
                    <ThemeSettings
                        settings={settings}
                        setSettings={setSettings}
                        handleSaveSettings={handleSaveSettings}
                        isLoggedIn={isLoggedIn}
                        defaultSettings={defaultSettings}
                    />
                )}
                {isSettingsOpen && (
                    <ApiAndModelSettings
                        settings={settings}
                        setSettings={setSettings}
                        handleSaveSettings={handleSaveSettings}
                        isLoggedIn={isLoggedIn}
                        defaultSettings={defaultSettings}
                    />
                )}
                {isPromptSettingsOpen && (
                    <PromptSettings
                        settings={settings}
                        setSettings={setSettings}
                        handleSaveSettings={handleSaveSettings}
                        isLoggedIn={isLoggedIn}
                        defaultSettings={defaultSettings}
                    />
                )}

                <div className="card-body">
                    <div className="row">
                        {/* URL 입력 시 원본 페이지를 띄우는 영역 */}
                        {isUrl && (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">원본 페이지</label>
                                <iframe src={text} title="Original Page" style={{ width: '100%', height: '1080px', border: '1px solid #ccc' }} />
                            </div>
                        )}
                        <div className={`mb-3 ${isUrl ? 'col-md-6' : 'col-md-12'}`}>
                            <label htmlFor="inputText" className="form-label">번역할 텍스트 (또는 URL)</label>
                            <textarea
                                className="form-control"
                                rows="10"
                                value={text}
                                onChange={handleTextInput}
                                placeholder="여기에 텍스트나 URL을 입력하세요."
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => { setText(''); }}
                        >
                            <i className="bi bi-x-circle me-1"></i>초기화
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleTranslate(text, settings)}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="ms-2">번역 중...</span>
                                </>
                            ) : (
                                '번역하기'
                            )}
                        </button>
                    </div>

                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label htmlFor="translatedText" className="form-label mb-0">번역 결과</label>
                            <div className="d-flex">
                                {translatedText && (
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => navigator.clipboard.writeText(translatedText)}
                                    >
                                        <i className="bi bi-clipboard me-1"></i>복사
                                    </button>
                                )}
                                {translatedText && (
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={handleCreatePost}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i>글쓰기
                                    </button>
                                )}
                            </div>
                        </div>
                        <div
                            className={`form-control bg-light ${error ? 'border-danger' : ''}`}
                            style={{
                                minHeight: '1080px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                fontFamily: settings.fontFamily || 'inherit',
                                fontSize: `${settings.fontSize}px`,
                                fontWeight: settings.fontWeight,
                                lineHeight: `${settings.lineHeight}em`,
                                textIndent: `${settings.textIndent}em`,
                                marginBottom: `${settings.sentenceHeight}px`
                            }}
                        >
                            {error ? (
                                <p className="text-danger small">{error}</p>
                            ) : (
                                translatedText
                            )}
                        </div>
                    </div>

                    {tokenCount > 0 && (
                        <div className="mt-2 text-end small text-muted">
                            사용된 토큰: {tokenCount}개
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TranslatorComponent;