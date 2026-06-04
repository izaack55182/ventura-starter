// CORE
import { Outlet } from 'react-router'

// COMPONENTS
import { Layout } from '@/routes/layout/components/public-layout'

export default function PublicLayout() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}
