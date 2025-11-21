#!/usr/bin/env node
/**
 * Simple web-based user role manager
 * Run this script and open http://localhost:3001 in your browser
 * 
 * Usage:
 *   1. Set environment variables:
 *      set SUPABASE_URL=https://your-project.supabase.co
 *      set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *   2. Run: node scripts/user-role-manager.js
 *   3. Open http://localhost:3001 in your browser
 */

const http = require('http');
const url = require('url');
const { createClient } = require('@supabase/supabase-js');

const PORT = 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set:');
  console.error('  SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Role Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #43245A;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        input, select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #43245A;
        }
        button {
            width: 100%;
            padding: 14px;
            background: #43245A;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #5a2f7a;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .message {
            margin-top: 20px;
            padding: 12px;
            border-radius: 6px;
            display: none;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }
        .users-list {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
        }
        .user-item {
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-email {
            font-weight: 500;
            color: #333;
        }
        .user-role {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .user-role.admin {
            background: #43245A;
            color: white;
        }
        .user-role.writer {
            background: #B6A8C1;
            color: #43245A;
        }
        .user-role.none {
            background: #e0e0e0;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>👥 User Role Manager</h1>
        <p class="subtitle">Set roles for admin and writer accounts</p>
        
        <form id="roleForm">
            <div class="form-group">
                <label for="email">User Email</label>
                <input type="email" id="email" name="email" required placeholder="user@example.com">
            </div>
            <div class="form-group">
                <label for="role">Role</label>
                <select id="role" name="role" required>
                    <option value="admin">Admin (Full Access)</option>
                    <option value="writer">Writer (Blog Management Only)</option>
                </select>
            </div>
            <button type="submit" id="submitBtn">Set Role</button>
        </form>
        
        <div id="message" class="message"></div>
        
        <div class="users-list">
            <h2 style="margin-bottom: 15px; color: #43245A;">Recent Users</h2>
            <div id="usersList">Loading users...</div>
        </div>
    </div>

    <script>
        const form = document.getElementById('roleForm');
        const messageDiv = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');
        const usersList = document.getElementById('usersList');

        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = 'message ' + type;
            setTimeout(() => {
                messageDiv.className = 'message';
            }, 5000);
        }

        function loadUsers() {
            fetch('/api/users')
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        usersList.innerHTML = '<p style="color: #721c24;">Error loading users</p>';
                        return;
                    }
                    if (data.users.length === 0) {
                        usersList.innerHTML = '<p style="color: #666;">No users found</p>';
                        return;
                    }
                    usersList.innerHTML = data.users.map(user => {
                        const role = user.user_metadata?.role || user.app_metadata?.role || 'none';
                        return \`
                            <div class="user-item">
                                <span class="user-email">\${user.email || 'No email'}</span>
                                <span class="user-role \${role}">\${role.charAt(0).toUpperCase() + role.slice(1)}</span>
                            </div>
                        \`;
                    }).join('');
                })
                .catch(err => {
                    usersList.innerHTML = '<p style="color: #721c24;">Error loading users</p>';
                });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Setting role...';

            const formData = new FormData(form);
            const data = {
                email: formData.get('email'),
                role: formData.get('role')
            };

            try {
                const response = await fetch('/api/set-role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showMessage(\`✅ Role set to "\${data.role}" for \${data.email}\`, 'success');
                    form.reset();
                    loadUsers();
                } else {
                    showMessage(\`❌ Error: \${result.error}\`, 'error');
                }
            } catch (error) {
                showMessage(\`❌ Error: \${error.message}\`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Set Role';
            }
        });

        // Load users on page load
        loadUsers();
        setInterval(loadUsers, 10000); // Refresh every 10 seconds
    </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve HTML
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
    return;
  }

  // API: Get users
  if (parsedUrl.pathname === '/api/users' && req.method === 'GET') {
    try {
      const { data: users, error } = await supabase.auth.admin.listUsers({
        perPage: 50
      });

      if (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ users: users.users || [] }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // API: Set role
  if (parsedUrl.pathname === '/api/set-role' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { email, role } = JSON.parse(body);

        if (!email || !role) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email and role are required' }));
          return;
        }

        if (!['admin', 'writer'].includes(role)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Role must be 'admin' or 'writer'" }));
          return;
        }

        // Get user by email
        const { data: users, error: listError } = await supabase.auth.admin.listUsers({
          perPage: 200
        });

        if (listError) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: listError.message }));
          return;
        }

        const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
          return;
        }

        // Update user metadata
        const newMetadata = {
          ...(user.user_metadata || {}),
          role
        };

        const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: newMetadata
        });

        if (updateError) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: updateError.message }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: updated.user }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('✅ User Role Manager is running!');
  console.log('');
  console.log(`🌐 Open in your browser: http://localhost:${PORT}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
});

