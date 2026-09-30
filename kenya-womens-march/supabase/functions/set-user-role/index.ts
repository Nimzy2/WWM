// Edge Function: set-user-role
// Secured by requiring an authenticated admin (user_metadata.role === 'admin')
// Creates a login, updates a password, or sets a role using the service role key

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

function userRole(user: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }) {
	return user.user_metadata?.role || user.app_metadata?.role || 'admin'
}

async function findUserByEmail(adminClient: ReturnType<typeof createClient>, email: string) {
	const targetEmail = email.toLowerCase()
	let page = 1

	while (page <= 10) {
		const { data: list, error: listErr } = await adminClient.auth.admin.listUsers({ page, perPage: 200 })
		if (listErr) throw new Error(listErr.message)
		const users = list?.users || []
		const target = users.find((u) => u.email?.toLowerCase() === targetEmail)
		if (target) return target
		if (users.length < 200) return null
		page += 1
	}

	return null
}

Deno.serve(async (req: Request) => {
	if (req.method !== 'POST') {
		return jsonResponse(405, { error: 'Method not allowed' })
	}

	try {
		const authHeader = req.headers.get('Authorization') || ''
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
		if (!token) return jsonResponse(401, { error: 'Missing Authorization header' })

		const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			global: { headers: { Authorization: `Bearer ${token}` } }
		})
		const { data: userData, error: userErr } = await userClient.auth.getUser()
		if (userErr || !userData?.user) return jsonResponse(401, { error: 'Invalid user' })

		const callerRole = userRole(userData.user)
		if (callerRole !== 'admin') {
			return jsonResponse(403, { error: 'Admin role required' })
		}

		const body = await req.json()
		const action = body.action || 'set-role'
		const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

		if (action === 'list') {
			const { data: list, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 200 })
			if (listErr) return jsonResponse(500, { error: listErr.message })
			const users = (list?.users || []).map((user) => ({
				id: user.id,
				email: user.email,
				role: userRole(user),
				created_at: user.created_at
			}))
			return jsonResponse(200, { success: true, users })
		}

		const email = String(body.email || '').trim().toLowerCase()
		const role = String(body.role || '').trim().toLowerCase()
		const password = typeof body.password === 'string' ? body.password : ''

		if (!email || !role) {
			return jsonResponse(400, { error: 'email and role are required' })
		}
		if (!['admin', 'writer'].includes(role)) {
			return jsonResponse(400, { error: "role must be 'admin' or 'writer'" })
		}

		if (action === 'create') {
			if (password.length < 6) {
				return jsonResponse(400, { error: 'Password must be at least 6 characters.' })
			}

			const existing = await findUserByEmail(adminClient, email)
			if (existing) {
				const { data: updated, error: updateErr } = await adminClient.auth.admin.updateUserById(existing.id, {
					password,
					email_confirm: true,
					user_metadata: { ...(existing.user_metadata || {}), role }
				})
				if (updateErr) return jsonResponse(500, { error: updateErr.message })
				return jsonResponse(200, {
					success: true,
					updated: true,
					id: updated?.user?.id,
					email: updated?.user?.email,
					role
				})
			}

			const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
				user_metadata: { role }
			})
			if (createErr) return jsonResponse(500, { error: createErr.message })
			return jsonResponse(200, {
				success: true,
				created: true,
				id: created?.user?.id,
				email: created?.user?.email,
				role
			})
		}

		const target = await findUserByEmail(adminClient, email)
		if (!target) return jsonResponse(404, { error: 'User not found' })

		const { data: updated, error: updateErr } = await adminClient.auth.admin.updateUserById(target.id, {
			user_metadata: { ...(target.user_metadata || {}), role }
		})
		if (updateErr) return jsonResponse(500, { error: updateErr.message })

		return jsonResponse(200, { success: true, id: updated?.user?.id, email: updated?.user?.email, role })
	} catch (e) {
		return jsonResponse(500, { error: e?.message || 'Unexpected error' })
	}
})
