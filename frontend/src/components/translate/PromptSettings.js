import React from 'react';

function PromptSettings({ settings, setSettings, handleSaveSettings, isLoggedIn, defaultSettings }) {
    const handleReset = () => {
        if (window.confirm('프롬프트 설정을 초기화하시겠습니까?')) {
            setSettings(prev => ({
                ...prev,
                customPrompt: defaultSettings.customPrompt,
                translationNotes: defaultSettings.translationNotes,
            }));
        }
    };

    return (
        <div className="card-body bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0">프롬포트 설정</h6>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleReset}>초기화</button>
                    {isLoggedIn && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSaveSettings({ customPrompt: settings.customPrompt, translationNotes: settings.translationNotes })}
                        >
                            저장
                        </button>
                    )}
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="customPrompt" className="form-label small">기본 프롬포트</label>
                <textarea
                    className="form-control form-control-sm"
                    id="customPrompt"
                    rows="4"
                    value={settings.customPrompt}
                    onChange={(e) => setSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                    placeholder="AI에게 번역 방법을 지시하는 내용을 작성하세요. (예: '정중한 문체로 번역해 줘.')"
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="translationNotes" className="form-label small">번역 노트</label>
                <textarea
                    className="form-control form-control-sm"
                    id="translationNotes"
                    rows="4"
                    value={settings.translationNotes}
                    onChange={(e) => setSettings(prev => ({ ...prev, translationNotes: e.target.value }))}
                    placeholder="특정 단어를 원하는 대로 번역하게끔 지시하세요. (예: 'Apple은 사과가 아닌 애플로 번역해 줘.')"
                ></textarea>
            </div>
        </div>
    );
}

export default PromptSettings;