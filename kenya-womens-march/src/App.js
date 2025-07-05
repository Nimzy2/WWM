import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import Join from './components/Join';
import Admin from './components/Admin';
import BlogPost from './components/BlogPost';
import NewsletterUnsubscribe from './components/NewsletterUnsubscribe';
import NewsletterAdmin from './components/NewsletterAdmin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join" element={<Join />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/unsubscribe" element={<NewsletterUnsubscribe />} />
            <Route path="/newsletter-admin" element={<NewsletterAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 