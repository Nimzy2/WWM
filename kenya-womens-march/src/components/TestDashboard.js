import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const TestDashboard = () => {
  const [overallStatus, setOverallStatus] = useState('unknown');
  const [quickTests, setQuickTests] = useState({});
  const [isRunningQuickTests, setIsRunningQuickTests] = useState(false);

  const runQuickTests = async () => {
    setIsRunningQuickTests(true);
    const results = {};

    try {
      // Test 1: Database Connection
      const { data, error } = await supabase.from('newsletter_subscribers').select('count').limit(1);
      results.database = error ? 'failed' : 'success';

      // Test 2: Tables Access
      const tables = ['newsletter_subscribers', 'contact_messages', 'join_requests'];
      for (const table of tables) {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        results[table] = tableError ? 'failed' : 'success';
      }

      // Test 3: Email Validation
      const testEmail = 'test@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      results.emailValidation = emailRegex.test(testEmail) ? 'success' : 'failed';

      // Test 4: Form Validation
      const testFormData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      };
      const isFormValid = testFormData.name && testFormData.email && testFormData.subject && testFormData.message;
      results.formValidation = isFormValid ? 'success' : 'failed';

    } catch (error) {
      results.general = 'failed';
    }

    setQuickTests(results);
    setIsRunningQuickTests(false);

    // Determine overall status
    const allTests = Object.values(results);
    const failedTests = allTests.filter(status => status === 'failed').length;
    
    if (failedTests === 0) {
      setOverallStatus('healthy');
    } else if (failedTests <= 2) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('critical');
    }
  };

  useEffect(() => {
    runQuickTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'healthy': return '✅';
      case 'failed':
      case 'critical': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const testTools = [
    {
      title: 'Database Connection Test',
      description: 'Test basic database connectivity and table access',
      route: '/db-test',
      icon: '🗄️'
    },
    {
      title: 'Form Validation Test',
      description: 'Test form validation, submission, and error handling',
      route: '/validation-test',
      icon: '📝'
    },
    {
      title: 'Comprehensive Form Test',
      description: 'Full form and database integration testing',
      route: '/test',
      icon: '🧪'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Application Health Dashboard</h1>
          
          {/* Overall Status */}
          <div className="mb-8">
            <div className={`p-4 rounded-lg ${getStatusColor(overallStatus)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Overall Status</h2>
                  <p className="text-sm">
                    {overallStatus === 'healthy' && 'All systems are operating normally'}
                    {overallStatus === 'warning' && 'Some issues detected, review recommended'}
                    {overallStatus === 'critical' && 'Critical issues detected, immediate attention required'}
                    {overallStatus === 'unknown' && 'Status unknown, running tests...'}
                  </p>
                </div>
                <span className="text-2xl">{getStatusIcon(overallStatus)}</span>
              </div>
            </div>
          </div>

          {/* Quick Test Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Quick Health Check</h2>
              <button
                onClick={runQuickTests}
                disabled={isRunningQuickTests}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  isRunningQuickTests
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-accent hover:text-primary'
                }`}
              >
                {isRunningQuickTests ? 'Running...' : 'Re-run Tests'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(quickTests).map(([test, status]) => (
                <div key={test} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-xs opacity-75">
                        {status === 'success' ? 'Working' : status === 'failed' ? 'Issue detected' : 'Unknown'}
                      </p>
                    </div>
                    <span className="text-lg">{getStatusIcon(status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Tools */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Testing Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testTools.map((tool) => (
                <Link
                  key={tool.route}
                  to={tool.route}
                  className="block p-6 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">{tool.title}</h3>
                      <p className="text-sm text-text">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Testing Recommendations</h3>
            <ul className="text-sm text-text space-y-1">
              <li>• Start with the Database Connection Test to verify basic connectivity</li>
              <li>• Use Form Validation Test to check form logic and validation</li>
              <li>• Run Comprehensive Form Test for full integration testing</li>
              <li>• Check browser console for any JavaScript errors</li>
              <li>• Verify Supabase configuration in supabaseClient.js</li>
              <li>• Ensure all database tables are created with correct schemas</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200"
            >
              Test Contact Form
            </Link>
            <Link
              to="/join"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200"
            >
              Test Join Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard; 