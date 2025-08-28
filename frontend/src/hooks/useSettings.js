import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { defaultPrompt, defaultTranslationNotes } from '../prompts';

// 초기 설정을 객체로 정의
const defaultSettings = {
    apiKey: '',
    backupApiKey1: '',
    backupApiKey2: '',
    temperature: 1.8,
    topP: 0.9,
    customPrompt: defaultPrompt,
    translationNotes: '',
    fontFamily: '',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.8,
    sentenceHeight: 8,
    textIndent: 1,
};

function useSettings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchUserSettings = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);

        try {
            const response = await axios.get('http://localhost:5000/api/users/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userSettings = JSON.parse(response.data.settings);
            setSettings(prev => ({ ...prev, ...userSettings }));
            console.log("사용자 설정 불러오기 성공");
        } catch (err) {
            console.error("사용자 설정 불러오기 실패:", err);
        }
    }, [navigate]);

    const handleSaveSettings = useCallback(async (settingsToSave) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return false;
        }
        try {
            await axios.put('http://localhost:5000/api/users/settings', { settings: settingsToSave }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('설정이 성공적으로 저장되었습니다!');
            return true;
        } catch (err) {
            alert(err.response?.data?.message || '설정 저장에 실패했습니다.');
            return false;
        }
    }, []);

    useEffect(() => {
        fetchUserSettings();
    }, [fetchUserSettings, navigate]);

    return { settings, setSettings, handleSaveSettings, fetchUserSettings, isLoggedIn, defaultSettings };
}

export default useSettings;