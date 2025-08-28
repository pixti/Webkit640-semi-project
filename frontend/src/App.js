import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MainContent from './components/common/MainContent';
import TranslatorComponent from './components/translate/TranslatorComponent';
import PostList from './components/posts/PostList';
import CreatePost from './components/posts/CreatePost';
import PostDetail from './components/posts/PostDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SearchResults from './components/posts/SearchResults';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/translator" element={<TranslatorComponent />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/posts/:categoryName" element={<PostList />} />
                        <Route path="/posts/:categoryName/:postId" element={<PostDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/search" element={<SearchResults />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;