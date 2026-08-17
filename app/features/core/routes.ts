import { index, route } from '@react-router/dev/routes'

export const coreRoutes = [
	index('features/core/dashboard/routes/dashboard.tsx'),
	route('dashboard', 'features/core/dashboard/routes/dashboard.tsx', { id: 'dashboard-alias' }),
]
