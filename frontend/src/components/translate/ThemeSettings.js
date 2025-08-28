import React from 'react';

function ThemeSettings({ settings, setSettings, handleSaveSettings, isLoggedIn, defaultSettings }) {
    const handleReset = () => {
        if (window.confirm('테마 설정을 초기화하시겠습니까?')) {
            setSettings(prev => ({ ...prev, ...defaultSettings }));
        }
    };

    return (
        <div className="card-body bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0">테마 설정</h6>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleReset}>초기화</button>
                    {isLoggedIn && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSaveSettings({
                                fontFamily: settings.fontFamily,
                                fontSize: settings.fontSize,
                                fontWeight: settings.fontWeight,
                                lineHeight: settings.lineHeight,
                                sentenceHeight: settings.sentenceHeight,
                                textIndent: settings.textIndent
                            })}
                        >
                            저장
                        </button>
                    )}
                </div>
            </div>
            <div className="row g-2">
                <div className="col-md-6 mb-3">
                    <label htmlFor="fontFamily" className="form-label small">폰트 종류</label>
                    <input type="text" className="form-control form-control-sm" id="fontFamily" value={settings.fontFamily} onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))} placeholder="기본 폰트 사용" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="fontSize" className="form-label small">글자 크기 (px)</label>
                    <input type="number" className="form-control form-control-sm" id="fontSize" step="1" min="10" value={settings.fontSize} onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="fontWeight" className="form-label small">글자 두께 (400-900)</label>
                    <input type="number" className="form-control form-control-sm" id="fontWeight" step="100" min="100" max="900" value={settings.fontWeight} onChange={(e) => setSettings(prev => ({ ...prev, fontWeight: e.target.value }))} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="lineHeight" className="form-label small">줄 간격</label>
                    <input type="number" className="form-control form-control-sm" id="lineHeight" step="0.1" min="0.1" value={settings.lineHeight} onChange={(e) => setSettings(prev => ({ ...prev, lineHeight: e.target.value }))} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="sentenceHeight" className="form-label small">문장 간격 (px)</label>
                    <input type="number" className="form-control form-control-sm" id="sentenceHeight" step="1" min="0" value={settings.sentenceHeight} onChange={(e) => setSettings(prev => ({ ...prev, sentenceHeight: e.target.value }))} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="textIndent" className="form-label small">들여쓰기 (em)</label>
                    <input type="number" className="form-control form-control-sm" id="textIndent" step="0.1" min="0" value={settings.textIndent} onChange={(e) => setSettings(prev => ({ ...prev, textIndent: e.target.value }))} />
                </div>
            </div>
        </div>
    );
}

export default ThemeSettings;