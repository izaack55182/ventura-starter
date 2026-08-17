import { layout, prefix, type RouteConfig, route } from '@react-router/dev/routes'
import { coreRoutes } from './features/core/routes'
import { marketingRoutes } from './features/marketing/routes'
import { securityRoutes } from './features/security/routes'
import { userRoutes } from './features/user/routes'

export default [
	// 1. PUBLIC / MARKETING
	...marketingRoutes,

	// 2. AUTHENTICATION (SECURITY)
	...securityRoutes,

	// 3. APPLICATION (CENTRALIZED)
	...prefix('c', [layout('routes/layout/layout-app.tsx', [...coreRoutes, ...userRoutes])]),

	// 4. RESOURCE ROUTES
	...prefix('r', [route('color-scheme', 'routes/resource/color-scheme.tsx')]),

	// 5. SYSTEM / ERRORS
	route('404', 'routes/404.tsx'),
	route('500', 'routes/500.tsx'),
	route('*', 'routes/catch-all.tsx'),
] satisfies RouteConfig
