import React, { useState } from 'react';

function ApiAndModelSettings({ settings, setSettings, handleSaveSettings, isLoggedIn, defaultSettings }) {
    const [showApiKeys, setShowApiKeys] = useState({ key: false, key1: false, key2: false });

    const handleReset = () => {
        if (window.confirm('API 및 모델 설정을 초기화하시겠습니까?')) {
            setSettings(prev => ({
                ...prev,
                apiKey: defaultSettings.apiKey,
                backupApiKey1: defaultSettings.backupApiKey1,
                backupApiKey2: defaultSettings.backupApiKey2,
                temperature: defaultSettings.temperature,
                topP: defaultSettings.topP,
            }));
        }
    };

    return (
        <div className="card-body bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title fw-bold mb-0">API 및 모델 설정</h6>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleReset}>초기화</button>
                    {isLoggedIn && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSaveSettings({
                                apiKey: settings.apiKey,
                                backupApiKey1: settings.backupApiKey1,
                                backupApiKey2: settings.backupApiKey2,
                                temperature: settings.temperature,
                                topP: settings.topP
                            })}
                        >
                            저장
                        </button>
                    )}
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="apiKey" className="form-label small">API 키</label>
                <div className="input-group">
                    <input
                        type={showApiKeys.key ? 'text' : 'password'}
                        className="form-control form-control-sm"
                        id="apiKey"
                        value={settings.apiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="주 API 키를 입력하세요"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, key: !prev.key }))}
                    >
                        <i className={`bi ${showApiKeys.key ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="backupKey1" className="form-label small">예비 API 키 1</label>
                <div className="input-group">
                    <input
                        type={showApiKeys.key1 ? 'text' : 'password'}
                        className="form-control form-control-sm"
                        id="backupKey1"
                        value={settings.backupApiKey1}
                        onChange={(e) => setSettings(prev => ({ ...prev, backupApiKey1: e.target.value }))}
                        placeholder="예비 API 키 1을 입력하세요"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, key1: !prev.key1 }))}
                    >
                        <i className={`bi ${showApiKeys.key1 ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="backupKey2" className="form-label small">예비 API 키 2</label>
                <div className="input-group">
                    <input
                        type={showApiKeys.key2 ? 'text' : 'password'}
                        className="form-control form-control-sm"
                        id="backupKey2"
                        value={settings.backupApiKey2}
                        onChange={(e) => setSettings(prev => ({ ...prev, backupApiKey2: e.target.value }))}
                        placeholder="예비 API 키 2를 입력하세요"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, key2: !prev.key2 }))}
                    >
                        <i className={`bi ${showApiKeys.key2 ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
            </div>
            <h6 className="card-title fw-bold">모델 설정</h6>
            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <label htmlFor="temperature" className="form-label small">온도 (Temperature)</label>
                    <input type="number" className="form-control form-control-sm" id="temperature" step="0.1" min="0" max="1" value={settings.temperature} onChange={(e) => setSettings(prev => ({ ...prev, temperature: e.target.value }))} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="topP" className="form-label small">Top-P</label>
                    <input type="number" className="form-control form-control-sm" id="topP" step="0.1" min="0" max="1" value={settings.topP} onChange={(e) => setSettings(prev => ({ ...prev, topP: e.target.value }))} />
                </div>
            </div>
        </div>
    );
}

export default ApiAndModelSettings;