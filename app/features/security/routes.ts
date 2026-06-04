import { layout, route } from '@react-router/dev/routes'

export const securityRoutes = [
	layout('routes/layout/layout-auth.tsx', [
		route('login', 'features/security/components/login.tsx'),
		route('register', 'features/security/components/sign-up.tsx'),
	]),
]
