import { index, layout, prefix, route } from '@react-router/dev/routes'

export const securityRoutes = [
	layout('routes/layout/layout-auth.tsx', [
		route('login', 'features/security/authentication/routes/login.tsx'),
		route('logout', 'features/security/authentication/routes/logout.tsx'),
		route('signup', 'features/security/authentication/routes/signup.tsx'),
		route('verify', 'features/security/authentication/routes/verify.tsx'),

		route('forgot-password', 'features/security/authentication/routes/forgot-password.tsx'),
		route('reset-password', 'features/security/authentication/routes/reset-password.tsx'),
	]),

	...prefix('onboarding', [
		index('features/security/authentication/routes/onboarding.tsx'),
		// route(':provider', 'features/security/authentication/routes/onboarding-provider.tsx'),
	]),
	...prefix('webauthn', [
		route('registration', 'features/security/authentication/web-auth/registration.ts'),
		route('authentication', 'features/security/authentication/web-auth/authentication.ts'),
	]),
]
