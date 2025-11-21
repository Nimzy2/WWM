#!/usr/bin/env node
/**
 * Set a Supabase user's role (stored in user_metadata.role) by email.
 *
 * Requirements:
 * - Node 18+
 * - Env vars:
 *    SUPABASE_URL=<your-supabase-project-url>
 *    SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
 *
 * Usage:
 *   node scripts/setUserRole.mjs <email> <role>
 *   node scripts/setUserRole.mjs writer@example.com writer
 *
 * Roles supported by this app: 'admin', 'writer'
 */

import { createClient } from '@supabase/supabase-js';

function exitWith(message, code = 1) {
	console.error(message);
	process.exit(code);
}

async function main() {
	const [,, email, role] = process.argv;
	if (!email || !role) {
		exitWith('Usage: node scripts/setUserRole.mjs <email> <role>');
	}
	if (!['admin', 'writer'].includes(role)) {
		exitWith("Invalid role. Allowed roles: 'admin', 'writer'");
	}

	const url = process.env.SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !serviceKey) {
		exitWith('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
	}

	const supabase = createClient(url, serviceKey, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	// Fetch user by email via Admin API
	const { data: users, error: listError } = await supabase.auth.admin.listUsers({
		perPage: 200
	});
	if (listError) exitWith(`Failed to list users: ${listError.message}`);

	const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
	if (!user) exitWith(`User not found for email: ${email}`);

	// Merge existing user_metadata with role
	const newMetadata = {
		...(user.user_metadata || {}),
		role
	};

	const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
		user_metadata: newMetadata
	});
	if (updateError) exitWith(`Failed to update user: ${updateError.message}`);

	console.log(`Success: Set role='${role}' for ${email} (id: ${user.id})`);
}

main().catch(err => {
	console.error('Unexpected error:', err);
	process.exit(1);
});


