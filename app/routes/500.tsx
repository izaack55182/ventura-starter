import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'
import type { Route } from './+types/500'

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: '500 - Server Error' },
		{ name: 'description', content: 'Something went wrong on our end.' },
	]
}

export default function ServerError() {
	const error = useRouteError()

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
								<path d="M0 0 L12.7 12.7 A18 18 0 0 1 -18 0 Z" className="fill-foreground" />
							</g>
						</svg>
					</div>

					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-normal tracking-tight">500</h1>
						<p className="text-sm md:text-base text-muted-foreground">
							Sorry, an unexpected error occurred on our end.
						</p>
					</div>

					<div className="pt-2">
						<Button asChild variant="secondary" className="rounded-full px-8 py-5">
							<Link to="/">Return Home</Link>
						</Button>
					</div>

					{isRouteErrorResponse(error) && (
						<div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive font-mono text-xs max-w-lg overflow-auto text-left w-full mx-4">
							{error.status} - {error.statusText}
							{error.data && (
								<pre className="mt-2 opacity-70">{JSON.stringify(error.data, null, 2)}</pre>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
