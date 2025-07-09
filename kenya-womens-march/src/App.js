import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Blogs from './components/Blogs';
import BlogPost from './components/BlogPost';
import Contact from './components/Contact';
import Join from './components/Join';
import NewsletterSignup from './components/NewsletterSignup';
import NewsletterAdmin from './components/NewsletterAdmin';
import NewsletterUnsubscribe from './components/NewsletterUnsubscribe';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import FormTester from './components/FormTester';
import DatabaseTest from './components/DatabaseTest';
import FormValidationTest from './components/FormValidationTest';
import TestDashboard from './components/TestDashboard';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/newsletter-admin" element={<NewsletterAdmin />} />
              <Route path="/unsubscribe" element={<NewsletterUnsubscribe />} />
              <Route path="/test" element={<FormTester />} />
              <Route path="/db-test" element={<DatabaseTest />} />
              <Route path="/validation-test" element={<FormValidationTest />} />
              <Route path="/test-dashboard" element={<TestDashboard />} />
              <Route path="*" element={
                <ErrorFallback 
                  title="Page Not Found"
                  message="The page you're looking for doesn't exist. Please check the URL or go back to the homepage."
                  showRefreshButton={false}
                />
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 