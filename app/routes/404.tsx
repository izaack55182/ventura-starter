import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import type { Route } from './+types/404'

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: '404 - Not Found' },
		{ name: 'description', content: 'The page you are looking for does not exist.' },
	]
}

export default function NotFound() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans">
			{/* Subtle grid/border container */}
			<div className="relative w-full max-w-4xl aspect-[2/1] md:border md:border-border flex flex-col items-center justify-center">
				{/* Corner crosshairs (only visible on md+) */}
				<div className="hidden md:block absolute -top-1.5 -left-1.5 text-muted-foreground/30 text-xs">
					+
				</div>
				<div className="hidden md:block absolute -top-1.5 -right-1.5 text-muted-foreground/30 text-xs">
					+
				</div>
				<div className="hidden md:block absolute -bottom-1.5 -left-1.5 text-muted-foreground/30 text-xs">
					+
				</div>
				<div className="hidden md:block absolute -bottom-1.5 -right-1.5 text-muted-foreground/30 text-xs">
					+
				</div>

				<div className="relative z-10 flex flex-col items-center text-center px-4 gap-8">
					{/* Minimalist Graphic */}
					<div className="relative flex items-center justify-center mb-4">
						<svg
							aria-hidden="true"
							width="120"
							height="120"
							viewBox="0 0 120 120"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="text-muted-foreground/40"
						>
							{/* Dashed Triangle */}
							<path
								d="M60 20 L100 90 L20 90 Z"
								stroke="currentColor"
								strokeWidth="1"
								strokeDasharray="2 4"
							/>
							{/* Overlapping Circle with Solid Wedge */}
							<g transform="translate(85, 80)">
								<circle
									cx="0"
									cy="0"
									r="18"
									className="fill-background"
									stroke="currentColor"
									strokeWidth="1"
								/>
								<path d="M0 0 L-12.7 12.7 A18 18 0 0 0 18 0 Z" className="fill-foreground" />
							</g>
						</svg>
					</div>

					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-normal tracking-tight">404</h1>
						<p className="text-sm md:text-base text-muted-foreground">
							Sorry, we couldn't find the page you're looking for.
						</p>
					</div>

					<div className="pt-2">
						<Button asChild variant="secondary" className="rounded-full px-8 py-5">
							<Link to="/">Return Home</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
