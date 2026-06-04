import { index, route } from '@react-router/dev/routes'

export const coreRoutes = [
	index('features/core/routes/dashboard.tsx'),
	route('dashboard', 'features/core/routes/dashboard.tsx', { id: 'dashboard-alias' }),
]
