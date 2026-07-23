import { redirect } from 'react-router'
import { logout } from '@/features/security/authentication/server/auth.server'
import type { Route } from '@/rr/features/security/authentication/routes/+types/logout.ts'

export async function loader() {
	return redirect('/')
}

export async function action({ request }: Route.ActionArgs) {
	return logout({ request })
}
