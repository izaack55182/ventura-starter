import { Outlet } from 'react-router'
import Logo from './components/logo'

export const meta = () => [{ name: 'robots', content: 'noindex, nofollow' }]

export default function LayoutAuth() {
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6">
			<div className="relative z-10 flex w-full max-w-[640px] flex-col items-center gap-8">
				<Logo variant="brand" className="w-60" />
				<Outlet />
			</div>
		</div>
	)
}
