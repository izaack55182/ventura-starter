import type { MetaFunction } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon'
import { getMeta } from '@/utils/misc'

export async function loader() {
	return {}
}

export default function Settings() {
	return (
		<div className="space-y-8 p-6 lg:p-8">
			{/* ... Rest of your component */}
			<div className="space-y-2">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
					Configuración
				</h1>
				<p className="text-lg text-muted-foreground max-w-[600px]">
					Administra tus preferencias personales y los ajustes globales del sistema.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Settings Sidebar */}
				<aside className="w-full lg:w-64 space-y-1">
					{[
						{ label: 'Perfil', icon: 'users', active: true },
						{ label: 'Notificaciones', icon: 'zap', active: false },
						{ label: 'Seguridad', icon: 'shield', active: false },
						{ label: 'Facturación', icon: 'package', active: false },
					].map((item, i) => (
						<Button
							key={i}
							variant={item.active ? 'secondary' : 'ghost'}
							className={
								item.active
									? 'w-full justify-start gap-3 h-10 px-3 bg-primary/10 text-primary hover:bg-primary/15'
									: 'w-full justify-start gap-3 h-10 px-3 text-muted-foreground'
							}
						>
							<Icon name={item.icon as IconName} className="size-4" />
							{item.label}
						</Button>
					))}
				</aside>

				<div className="flex-1 space-y-6">
					<Card className="border-primary/5">
						<CardHeader>
							<CardTitle>Perfil de Usuario</CardTitle>
							<CardDescription>Cómo te verán los demás en la plataforma.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center gap-6 pb-6 border-b border-border/50">
								<div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-2xl font-bold text-primary shadow-inner">
									IZ
								</div>
								<div className="space-y-1">
									<Button variant="outline" size="sm">
										Cambiar Avatar
									</Button>
									<p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
										JPG, PNG o GIF. Máx 5MB.
									</p>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
										Nombre Completo
									</div>
									<div className="h-10 px-3 bg-muted/50 border border-border rounded-lg flex items-center text-sm font-medium">
										Izaack
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
										Correo Electrónico
									</div>
									<div className="h-10 px-3 bg-muted/50 border border-border rounded-lg flex items-center text-sm font-medium">
										izaack@ventura.com
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-3 pt-4">
								<Button variant="ghost">Cancelar</Button>
								<Button className="shadow-lg shadow-primary/20">Guardar Cambios</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ matches, location }: any) => {
	return getMeta({
		title: 'Configuración',
		description: 'Administra tus preferencias en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}
