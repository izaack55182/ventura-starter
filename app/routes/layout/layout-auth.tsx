import { Outlet } from 'react-router'
import Logo from './components/logo'

export default function LayoutAuth() {
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
			{/* Background enhancement */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1]" />
			<div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 w-full max-w-sm sm:max-w-md px-2 sm:px-0">
				{/* Logo top placement */}
				<Logo variant="long" className="w-28 md:w-32" />

				{/* Glassmorphism Card Wrapper */}
				<div className="w-full bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden group">
					{/* Subtle inner glow */}
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

					<Outlet />
				</div>

				{/* Footer text or links could go here */}
				<p className="text-[10px] font-mono uppercase tracking-[2px] text-muted-foreground/40 text-center">
					Secure Enterprise Infrastructure
				</p>
			</div>
		</div>
	)
}
