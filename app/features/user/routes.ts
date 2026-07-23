import { index, layout, prefix, route } from '@react-router/dev/routes'

export const userRoutes = [
	route('profile', 'features/user/routes/profile.tsx', [
		route('verify', 'features/user/routes/profile-verify.tsx'),
		...prefix('two-factor', [
			index('features/user/routes/two-factor.tsx'),
			route('disable', 'features/user/routes/two-factor-disable.tsx'),
			route('verify', 'features/user/routes/two-factor-verify.tsx'),
		]),
		route('passkeys', 'features/user/routes/passkeys.tsx'),
	]),
]
