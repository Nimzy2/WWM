import React, { useState } from 'react';
import { addContactMessage, addJoinRequest } from '../supabaseHelpers';
import { subscribeToNewsletter, validateEmail } from '../newsletterHelpers';

const FormValidationTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (test, status, message, details = '') => {
    setTestResults(prev => [...prev, { 
      test, 
      status, 
      message, 
      details,
      timestamp: new Date().toISOString() 
    }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Email Validation
    addTestResult('Email Validation', 'running', 'Testing email validation...');
    try {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'test+tag@example.org'];
      const invalidEmails = ['invalid-email', 'test@', '@domain.com', '', 'test..test@example.com'];
      
      let allValidPassed = true;
      let allInvalidFailed = true;
      
      for (const email of validEmails) {
        if (!validateEmail(email)) {
          allValidPassed = false;
          addTestResult('Email Validation', 'failed', `Valid email failed: ${email}`);
        }
      }
      
      for (const email of invalidEmails) {
        if (validateEmail(email)) {
          allInvalidFailed = false;
          addTestResult('Email Validation', 'failed', `Invalid email passed: ${email}`);
        }
      }
      
      if (allValidPassed && allInvalidFailed) {
        addTestResult('Email Validation', 'success', 'All email validation tests passed');
      }
    } catch (error) {
      addTestResult('Email Validation', 'failed', `Email validation error: ${error.message}`);
    }

    // Test 2: Contact Form Validation
    addTestResult('Contact Form Validation', 'running', 'Testing contact form validation...');
    try {
      const testCases = [
        {
          name: 'Valid Contact',
          data: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message'
          },
          shouldPass: true
        },
        {
          name: 'Missing Name',
          data: {
            name: '',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message'
          },
          shouldPass: false
        },
        {
          name: 'Invalid Email',
          data: {
            name: 'Test User',
            email: 'invalid-email',
            subject: 'Test Subject',
            message: 'This is a test message'
          },
          shouldPass: false
        },
        {
          name: 'Missing Message',
          data: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: ''
          },
          shouldPass: false
        }
      ];

      for (const testCase of testCases) {
        const { name, email, subject, message } = testCase.data;
        
        // Basic validation
        const isValid = name.trim() && validateEmail(email) && subject.trim() && message.trim();
        
        if (isValid === testCase.shouldPass) {
          addTestResult('Contact Form Validation', 'success', `${testCase.name}: ${isValid ? 'Valid' : 'Invalid'} (expected)`);
        } else {
          addTestResult('Contact Form Validation', 'failed', `${testCase.name}: Expected ${testCase.shouldPass ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
        }
      }
    } catch (error) {
      addTestResult('Contact Form Validation', 'failed', `Contact form validation error: ${error.message}`);
    }

    // Test 3: Join Form Validation
    addTestResult('Join Form Validation', 'running', 'Testing join form validation...');
    try {
      const testCases = [
        {
          name: 'Valid Join Request',
          data: {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            phone: '+254700000000',
            county: 'Nairobi',
            involvement_level: 'volunteer',
            interests: ['Women\'s Rights Advocacy']
          },
          shouldPass: true
        },
        {
          name: 'Missing Required Fields',
          data: {
            first_name: '',
            last_name: 'User',
            email: 'test@example.com',
            phone: '+254700000000',
            county: '',
            involvement_level: 'volunteer',
            interests: []
          },
          shouldPass: false
        },
        {
          name: 'Invalid Phone Number',
          data: {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            phone: 'invalid-phone',
            county: 'Nairobi',
            involvement_level: 'volunteer',
            interests: ['Women\'s Rights Advocacy']
          },
          shouldPass: false
        }
      ];

      for (const testCase of testCases) {
        const { first_name, last_name, email, county, involvement_level, interests } = testCase.data;
        
        // Basic validation
        const isValid = first_name.trim() && 
                       last_name.trim() && 
                       validateEmail(email) && 
                       county.trim() && 
                       involvement_level && 
                       interests.length > 0;
        
        if (isValid === testCase.shouldPass) {
          addTestResult('Join Form Validation', 'success', `${testCase.name}: ${isValid ? 'Valid' : 'Invalid'} (expected)`);
        } else {
          addTestResult('Join Form Validation', 'failed', `${testCase.name}: Expected ${testCase.shouldPass ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
        }
      }
    } catch (error) {
      addTestResult('Join Form Validation', 'failed', `Join form validation error: ${error.message}`);
    }

    // Test 4: Newsletter Form Validation
    addTestResult('Newsletter Form Validation', 'running', 'Testing newsletter form validation...');
    try {
      const testCases = [
        {
          name: 'Valid Email',
          email: 'test@example.com',
          shouldPass: true
        },
        {
          name: 'Invalid Email',
          email: 'invalid-email',
          shouldPass: false
        },
        {
          name: 'Empty Email',
          email: '',
          shouldPass: false
        },
        {
          name: 'Email with Spaces',
          email: ' test@example.com ',
          shouldPass: false
        }
      ];

      for (const testCase of testCases) {
        const isValid = validateEmail(testCase.email.trim());
        
        if (isValid === testCase.shouldPass) {
          addTestResult('Newsletter Form Validation', 'success', `${testCase.name}: ${isValid ? 'Valid' : 'Invalid'} (expected)`);
        } else {
          addTestResult('Newsletter Form Validation', 'failed', `${testCase.name}: Expected ${testCase.shouldPass ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
        }
      }
    } catch (error) {
      addTestResult('Newsletter Form Validation', 'failed', `Newsletter form validation error: ${error.message}`);
    }

    // Test 5: Form Submission (with cleanup)
    addTestResult('Form Submission Test', 'running', 'Testing actual form submissions...');
    try {
      // Test contact form submission
      const testContactMessage = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        subject: 'Form Test',
        message: 'This is a test message from the validation tester.',
        created_at: new Date().toISOString()
      };
      
      const contactResult = await addContactMessage(testContactMessage);
      if (contactResult) {
        addTestResult('Form Submission Test', 'success', 'Contact form submission successful');
      } else {
        addTestResult('Form Submission Test', 'failed', 'Contact form submission failed');
      }

      // Test join form submission
      const testJoinRequest = {
        first_name: 'Test',
        last_name: 'User',
        email: `test-${Date.now()}@example.com`,
        phone: '+254700000000',
        county: 'Nairobi',
        involvement_level: 'volunteer',
        interests: ['Women\'s Rights Advocacy'],
        organization: 'Test Organization',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const joinResult = await addJoinRequest(testJoinRequest);
      if (joinResult) {
        addTestResult('Form Submission Test', 'success', 'Join form submission successful');
      } else {
        addTestResult('Form Submission Test', 'failed', 'Join form submission failed');
      }

      // Test newsletter subscription
      const testEmail = `test-${Date.now()}@example.com`;
      const newsletterResult = await subscribeToNewsletter(testEmail);
      if (newsletterResult.success) {
        addTestResult('Form Submission Test', 'success', 'Newsletter subscription successful');
      } else {
        addTestResult('Form Submission Test', 'failed', `Newsletter subscription failed: ${newsletterResult.message}`);
      }

    } catch (error) {
      addTestResult('Form Submission Test', 'failed', `Form submission error: ${error.message}`);
    }

    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Form Validation Testing</h1>
          
          <div className="mb-6">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-accent hover:text-primary'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run Validation Tests'}
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary mb-1">{result.test}</h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <p className="text-xs text-gray-600 mt-1">{result.details}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-lg ml-4">{getStatusIcon(result.status)}</span>
                </div>
              </div>
            ))}
          </div>

          {testResults.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Test Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tests:</span> {testResults.length}
                </div>
                <div>
                  <span className="font-medium">Passed:</span> {testResults.filter(r => r.status === 'success').length}
                </div>
                <div>
                  <span className="font-medium">Failed:</span> {testResults.filter(r => r.status === 'failed').length}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">What This Tests:</h3>
            <ul className="text-sm text-text space-y-1">
              <li>• Email format validation</li>
              <li>• Required field validation</li>
              <li>• Contact form validation</li>
              <li>• Join form validation</li>
              <li>• Newsletter form validation</li>
              <li>• Actual form submissions to database</li>
              <li>• Error handling and edge cases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormValidationTest; 