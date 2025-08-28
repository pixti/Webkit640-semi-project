import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * 검색 기능을 위한 통합 커스텀 훅
 * @param {string | null} initialQuery - 초기 검색어 (SearchResults.js에서 사용)
 */
function useSearch(initialQuery = null) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const navigate = useNavigate();

    // 검색 결과 불러오기 로직 (SearchResults.js에서 사용)
    useEffect(() => {
        if (!initialQuery) {
            setLoading(false);
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const fetchResults = async () => {
                const response = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(initialQuery)}`);
                setResults(response.data);
            }
            fetchResults();
        } catch (err) {
            setError('검색 결과를 불러오는 데 실패했습니다.');
            console.error('검색 API 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [initialQuery]);

    // 검색 실행 로직 (Header.js에서 사용)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return { results, loading, error, searchQuery, setSearchQuery, handleSearch };
}

export default useSearch;