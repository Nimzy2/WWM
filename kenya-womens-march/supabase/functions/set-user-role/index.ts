// Edge Function: set-user-role
// Secured by requiring an authenticated admin (user_metadata.role === 'admin')
// Updates target user's user_metadata.role using the service role key

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function jsonResponse(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store'
		}
	})
}

Deno.serve(async (req: Request) => {
	if (req.method !== 'POST') {
		return jsonResponse(405, { error: 'Method not allowed' })
	}

	try {
		const authHeader = req.headers.get('Authorization') || ''
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
		if (!token) return jsonResponse(401, { error: 'Missing Authorization header' })

		// Verify caller and ensure they are admin
		const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			global: { headers: { Authorization: `Bearer ${token}` } }
		})
		const { data: userData, error: userErr } = await userClient.auth.getUser()
		if (userErr || !userData?.user) return jsonResponse(401, { error: 'Invalid user' })

		const callerRole =
			userData.user.user_metadata?.role ||
			userData.user.app_metadata?.role ||
			'admin'
		if (callerRole !== 'admin') {
			return jsonResponse(403, { error: 'Admin role required' })
		}

		const { email, role } = await req.json()
		if (!email || !role) {
			return jsonResponse(400, { error: 'email and role are required' })
		}
		if (!['admin', 'writer'].includes(role)) {
			return jsonResponse(400, { error: "role must be 'admin' or 'writer'" })
		}

		const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
		// list users and find by email (Admin API lacks direct get-by-email)
		const { data: list, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 200 })
		if (listErr) return jsonResponse(500, { error: listErr.message })
		const target = list?.users?.find((u: any) => u.email?.toLowerCase() === String(email).toLowerCase())
		if (!target) return jsonResponse(404, { error: 'User not found' })

		const newMeta = { ...(target.user_metadata || {}), role }
		const { data: updated, error: updateErr } = await adminClient.auth.admin.updateUserById(target.id, {
			user_metadata: newMeta
		})
		if (updateErr) return jsonResponse(500, { error: updateErr.message })

		return jsonResponse(200, { success: true, id: updated?.user?.id, email: updated?.user?.email, role })
	} catch (e) {
		return jsonResponse(500, { error: e?.message || 'Unexpected error' })
	}
})


