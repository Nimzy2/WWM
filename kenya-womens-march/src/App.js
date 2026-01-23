import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
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
import JoinRequestManagement from './components/JoinRequestManagement';
import DatabaseTest from './components/DatabaseTest';
import FormValidationTest from './components/FormValidationTest';
import TestDashboard from './components/TestDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PostEditor from './components/PostEditor';
import PostManagement from './components/PostManagement';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ContactMessagesAdmin from './components/ContactMessagesAdmin';
import Publications from './components/Publications';
import PublicationManagement from './components/PublicationManagement';
import PublicationEditor from './components/PublicationEditor';

function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          <ScrollToTop />
          <div 
            className="App min-h-screen flex flex-col relative"
            style={{
              backgroundImage: `url(/codioful.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join" element={<Join />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/newsletter-admin" element={<NewsletterAdmin />} />
                <Route path="/unsubscribe" element={<NewsletterUnsubscribe />} />
                <Route path="/test" element={<FormTester />} />
                <Route path="/db-test" element={<DatabaseTest />} />
                <Route path="/validation-test" element={<FormValidationTest />} />
                <Route path="/test-dashboard" element={<TestDashboard />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/posts"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PostManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/join-requests"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <JoinRequestManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/subscribers"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <NewsletterAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ContactMessagesAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/posts/new"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PostEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/posts/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PostEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/publications"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PublicationManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/publications/new"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PublicationEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/publications/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'writer']}>
                      <PublicationEditor />
                    </ProtectedRoute>
                  }
                />
                
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
          </div>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default App; 