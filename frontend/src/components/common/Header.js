import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStatus from '../../hooks/useAuthStatus';
import useTheme from '../../hooks/useTheme';
import useSearch from '../../hooks/useSearch';

function Header() {
    const { isLoggedIn, username, handleLogout } = useAuthStatus();
    const { theme, toggleTheme } = useTheme();
    const { searchQuery, setSearchQuery, handleSearch } = useSearch();

    return (
        <header className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
            <nav className="container-lg">
                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-globe-asia-australia fs-3 me-2 text-primary"></i>
                    <span className="fw-bold fs-5">Semi-Project</span>
                </Link>

                {/* Desktop Search Bar */}
                <div className="flex-grow-1 mx-2 d-none d-lg-block">
                    <form className="input-group" onSubmit={handleSearch}>
                        <input className="form-control border-start-0" type="search" placeholder="검색어를 입력하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <button className="input-group-text bg-body-secondary border-start-0" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>

                {/* Mobile Search Toggle */}
                <button
                    className="btn d-lg-none ms-auto"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileSearch"
                    aria-expanded="false"
                    aria-controls="mobileSearch"
                >
                    <i className="bi bi-search fs-5"></i>
                </button>

                {/* Right side buttons */}
                <div className="d-flex align-items-center">
                    {isLoggedIn && (
                        <Link to="/create-post" className="btn btn-outline-secondary d-none d-md-flex align-items-center me-2">
                            <i className="bi bi-plus-lg me-1"></i>글쓰기
                        </Link>
                    )}
                    <button id="theme-toggler" className="btn" type="button" onClick={toggleTheme}>
                        <i className={`bi bi-sun fs-5 ${theme === 'dark' ? 'd-none' : 'd-block'}`}></i>
                        <i className={`bi bi-moon fs-5 ${theme === 'light' ? 'd-none' : 'd-block'}`}></i>
                    </button>
                    {isLoggedIn ? (
                        <>
                            <span className="me-2 fw-bold text-dark-emphasis d-none d-md-block">{username}님</span>
                            <button className="btn btn-primary rounded-pill ms-2" onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary rounded-pill ms-2">로그인</Link>
                    )}
                </div>
            </nav>
            {/* Mobile Search Collapse Area */}
            <div className="collapse w-100 d-lg-none" id="mobileSearch">
                <div className="px-3 bg-body-tertiary border-top">
                    <form className="input-group" onSubmit={handleSearch}>
                        <input className="form-control border-start-0" type="search" placeholder="검색어를 입력하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <button className="input-group-text bg-body-secondary border-start-0" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default Header;