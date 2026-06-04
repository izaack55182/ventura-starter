import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { Route } from './+types/404'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: '404 - Not Found' },
		{ name: 'description', content: 'The page you are looking for does not exist.' },
	]
}

export default function NotFound() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
			{/* Background Ambience */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 blur-[120px] rounded-full" />
			</div>

			<div className="relative z-10 flex flex-col items-center text-center px-4 gap-6">
				{/* Glitchy Text Effect */}
				<h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none">
					404
				</h1>

				<div className="space-y-2">
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight">Lost in the Edge</h2>
					<p className="text-muted-foreground max-w-[400px]">
						La ruta que buscas no ha sido replicada en este nodo. Es posible que haya sido eliminada
						o nunca existió.
					</p>
				</div>

				<div className="pt-4">
					<Button asChild variant="secondary" className="gap-2">
						<Link to="/">
							<Icon name="house" size="sm" />
							Volver al inicio
						</Link>
					</Button>
				</div>

				{/* Terminal decorative */}
				<div className="mt-12 w-full max-w-md bg-zinc-950 rounded-lg border border-white/10 p-4 font-mono text-xs text-left shadow-2xl opacity-80">
					<div className="flex gap-1.5 mb-3">
						<div className="size-2.5 rounded-full bg-red-500/20" />
						<div className="size-2.5 rounded-full bg-yellow-500/20" />
						<div className="size-2.5 rounded-full bg-green-500/20" />
					</div>
					<div className="space-y-1 text-muted-foreground">
						<p>
							<span className="text-red-400">Error:</span> Route not found
						</p>
						<p>
							<span className="text-blue-400">at</span> Edge_Worker_4021 (cdg)
						</p>
						<p>
							<span className="text-blue-400">at</span> handleRequest (worker.js:12:45)
						</p>
						<p className="animate-pulse">_</p>
					</div>
				</div>
			</div>
		</div>
	)
}
