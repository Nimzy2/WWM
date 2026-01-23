import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DatabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic connection
      addTestResult('Database Connection', 'running', 'Testing connection to Supabase...');
      const { error } = await supabase.from('newsletter_subscribers').select('count').limit(1);
      
      if (error) {
        addTestResult('Database Connection', 'failed', `Connection failed: ${error.message}`);
        setConnectionStatus('failed');
      } else {
        addTestResult('Database Connection', 'success', 'Successfully connected to database');
        setConnectionStatus('connected');
      }

      // Test 2: Newsletter table access
      addTestResult('Newsletter Table', 'running', 'Testing newsletter_subscribers table...');
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .limit(5);
      
      if (newsletterError) {
        addTestResult('Newsletter Table', 'failed', `Table access failed: ${newsletterError.message}`);
      } else {
        addTestResult('Newsletter Table', 'success', `Table accessible - found ${newsletterData?.length || 0} records`);
      }

      // Test 3: Contact messages table
      addTestResult('Contact Table', 'running', 'Testing contact_messages table...');
      const { data: contactData, error: contactError } = await supabase
        .from('contact_messages')
        .select('*')
        .limit(5);
      
      if (contactError) {
        addTestResult('Contact Table', 'failed', `Table access failed: ${contactError.message}`);
      } else {
        addTestResult('Contact Table', 'success', `Table accessible - found ${contactData?.length || 0} records`);
      }

      // Test 4: Join requests table
      addTestResult('Join Table', 'running', 'Testing join_requests table...');
      const { data: joinData, error: joinError } = await supabase
        .from('join_requests')
        .select('*')
        .limit(5);
      
      if (joinError) {
        addTestResult('Join Table', 'failed', `Table access failed: ${joinError.message}`);
      } else {
        addTestResult('Join Table', 'success', `Table accessible - found ${joinData?.length || 0} records`);
      }

      // Test 5: Insert test (newsletter)
      addTestResult('Insert Test', 'running', 'Testing insert operation...');
      const testEmail = `test-${Date.now()}@example.com`;
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: testEmail, is_active: true }])
        .select();
      
      if (insertError) {
        addTestResult('Insert Test', 'failed', `Insert failed: ${insertError.message}`);
      } else {
        addTestResult('Insert Test', 'success', 'Successfully inserted test record');
        
        // Clean up test record
        await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('email', testEmail);
      }

    } catch (error) {
      addTestResult('General Error', 'failed', `Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Database Connection Test</h1>
          
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                Status: {connectionStatus === 'connected' ? 'Connected' : 
                        connectionStatus === 'failed' ? 'Failed' : 'Testing...'}
              </div>
              
              <button
                onClick={testConnection}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-accent hover:text-primary'
                }`}
              >
                {isLoading ? 'Testing...' : 'Re-run Tests'}
              </button>
            </div>
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
              <li>• Basic connection to Supabase database</li>
              <li>• Access to newsletter_subscribers table</li>
              <li>• Access to contact_messages table</li>
              <li>• Access to join_requests table</li>
              <li>• Insert operations (with cleanup)</li>
              <li>• Row Level Security (RLS) policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 