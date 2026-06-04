import type { MetaFunction } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { getMeta } from '@/utils/misc'

export async function loader() {
	return {}
}

export default function Customers() {
	return (
		<div className="space-y-8 p-6 lg:p-8">
			{/* ... Rest of your component */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
						Clientes
					</h1>
					<p className="text-lg text-muted-foreground max-w-[600px]">
						Gestiona tus relaciones comerciales, prospectos y clientes activos.
					</p>
				</div>
				<Button className="h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
					<Icon name="contact" className="size-4 mr-2" />
					Nuevo Cliente
				</Button>
			</div>

			{/* CRM Stats */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-primary/5 bg-gradient-to-br from-card to-emerald-500/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Clientes Activos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">1,234</div>
						<p className="text-xs text-muted-foreground mt-1">+12 nuevos este mes</p>
					</CardContent>
				</Card>
				<Card className="border-primary/5 bg-gradient-to-br from-card to-amber-500/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Prospectos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">456</div>
						<p className="text-xs text-muted-foreground mt-1">15 en seguimiento hoy</p>
					</CardContent>
				</Card>
				<Card className="border-primary/5 bg-gradient-to-br from-card to-blue-500/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Tasa de Conversión
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">24.5%</div>
						<p className="text-xs text-muted-foreground mt-1">+2% respecto al anterior</p>
					</CardContent>
				</Card>
			</div>

			<Card className="border-primary/5 shadow-xl shadow-foreground/5 overflow-hidden">
				<CardHeader className="bg-muted/30 border-b border-border/50">
					<CardTitle className="text-lg">Directorio de Clientes</CardTitle>
					<CardDescription>Busca y filtra tus clientes corporativos.</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<div className="relative w-full overflow-auto text-center py-20 bg-muted/5 border-b border-border/40">
						<div className="max-w-[300px] mx-auto space-y-4">
							<div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
								<Icon name="contact" className="size-6" />
							</div>
							<div className="space-y-1">
								<p className="font-semibold">Módulo CRM en construcción</p>
								<p className="text-xs text-muted-foreground italic">
									Estamos puliendo la base de datos de clientes para ofrecerte la mejor experiencia.
								</p>
							</div>
							<Button variant="outline" size="sm" className="w-full">
								Previsualizar Formulario
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ matches, location }: any) => {
	return getMeta({
		title: 'CRM',
		description: 'Gestión de clientes en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}
