import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { Route } from './+types/500'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: '500 - Server Error' },
		{ name: 'description', content: 'Something went wrong on our end.' },
	]
}

export default function ServerError() {
	const error = useRouteError()

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center text-foreground relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[120px] rounded-full" />
			</div>

			<div className="relative z-10 flex flex-col items-center text-center px-4 gap-6">
				<h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none">
					500
				</h1>

				<div className="space-y-2">
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight">System Failure</h2>
					<p className="text-muted-foreground max-w-[400px]">
						Algo salió mal en el servidor. Nuestro equipo de ingeniería ya ha sido notificado.
					</p>
				</div>

				<div className="pt-4 flex gap-4">
					<Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
						<Icon name="refresh-ccw" size="sm" />
						Reintentar
					</Button>
					<Button asChild>
						<Link to="/">Ir al inicio</Link>
					</Button>
				</div>

				{isRouteErrorResponse(error) && (
					<div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-xs max-w-lg overflow-auto">
						{error.status} - {error.statusText}
						{error.data && <pre className="mt-2">{JSON.stringify(error.data, null, 2)}</pre>}
					</div>
				)}
			</div>
		</div>
	)
}
