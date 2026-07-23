import { Outlet } from 'react-router'
import Logo from './components/logo'

export default function LayoutAuth() {
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
			<div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
				<Logo variant="brand" className="w-60" />
				<div className="w-full bg-card rounded-2xl p-8 border border-border relative overflow-hidden group">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
