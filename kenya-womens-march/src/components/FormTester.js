import React, { useState } from 'react';
import { addContactMessage, addJoinRequest } from '../supabaseHelpers';
import { subscribeToNewsletter, unsubscribeFromNewsletter, validateEmail } from '../newsletterHelpers';
import { supabase } from '../supabaseClient';

const FormTester = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runTest = async (testName, testFunction) => {
    setCurrentTest(testName);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', message: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'error', message: error.message }
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    // Test 1: Supabase Connection
    await runTest('Supabase Connection', async () => {
      const { data, error } = await supabase.from('site_stats').select('count').limit(1);
      if (error) throw new Error(`Database connection failed: ${error.message}`);
      return 'Database connection successful';
    });

    // Test 2: Contact Form
    await runTest('Contact Form', async () => {
      const testMessage = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message',
        message: 'This is a test message from the form tester.',
        created_at: new Date().toISOString()
      };
      
      const result = await addContactMessage(testMessage);
      if (!result) throw new Error('Contact form submission failed');
      return 'Contact form submission successful';
    });

    // Test 3: Join Form
    await runTest('Join Form', async () => {
      const testRequest = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '+254700000000',
        county: 'Nairobi',
        involvement_level: 'volunteer',
        interests: ['Women\'s Rights Advocacy'],
        organization: 'Test Organization',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const result = await addJoinRequest(testRequest);
      if (!result) throw new Error('Join form submission failed');
      return 'Join form submission successful';
    });

    // Test 4: Newsletter Subscription
    await runTest('Newsletter Subscription', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const result = await subscribeToNewsletter(testEmail);
      if (!result.success) throw new Error(`Newsletter subscription failed: ${result.message}`);
      return 'Newsletter subscription successful';
    });

    // Test 5: Newsletter Unsubscription
    await runTest('Newsletter Unsubscription', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      // First subscribe
      await subscribeToNewsletter(testEmail);
      // Then unsubscribe
      const result = await unsubscribeFromNewsletter(testEmail);
      if (!result.success) throw new Error(`Newsletter unsubscription failed: ${result.message}`);
      return 'Newsletter unsubscription successful';
    });

    // Test 6: Email Validation
    await runTest('Email Validation', async () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
      const invalidEmails = ['invalid-email', 'test@', '@domain.com', ''];
      
      for (const email of validEmails) {
        if (!validateEmail(email)) {
          throw new Error(`Valid email failed validation: ${email}`);
        }
      }
      
      for (const email of invalidEmails) {
        if (validateEmail(email)) {
          throw new Error(`Invalid email passed validation: ${email}`);
        }
      }
      
      return 'Email validation working correctly';
    });

    // Test 7: Blog Data Fetching
    await runTest('Blog Data Fetching', async () => {
      const { data, error } = await supabase.from('blogs').select('*').limit(5);
      if (error) throw new Error(`Blog fetching failed: ${error.message}`);
      return `Blog fetching successful - found ${data?.length || 0} posts`;
    });

    // Test 8: Site Stats Fetching
    await runTest('Site Stats Fetching', async () => {
      const { data, error } = await supabase.from('site_stats').select('*');
      if (error) throw new Error(`Site stats fetching failed: ${error.message}`);
      return `Site stats fetching successful - found ${data?.length || 0} stats`;
    });

    setIsRunning(false);
    setCurrentTest('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Form & Database Testing</h1>
          
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
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            {isRunning && currentTest && (
              <p className="mt-2 text-sm text-accent">Currently testing: {currentTest}</p>
            )}
          </div>

          <div className="space-y-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary mb-1">{testName}</h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                  </div>
                  <span className="text-lg ml-4">{getStatusIcon(result.status)}</span>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Test Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tests:</span> {Object.keys(testResults).length}
                </div>
                <div>
                  <span className="font-medium">Passed:</span> {Object.values(testResults).filter(r => r.status === 'success').length}
                </div>
                <div>
                  <span className="font-medium">Failed:</span> {Object.values(testResults).filter(r => r.status === 'error').length}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">What This Tests:</h3>
            <ul className="text-sm text-text space-y-1">
              <li>• Database connection to Supabase</li>
              <li>• Contact form submission and storage</li>
              <li>• Join form submission and validation</li>
              <li>• Newsletter subscription/unsubscription</li>
              <li>• Email validation logic</li>
              <li>• Blog data fetching</li>
              <li>• Site statistics fetching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTester; 