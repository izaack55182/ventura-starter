import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'

export default function Dashboard() {
	return (
		<div className="space-y-6 p-4 md:space-y-8 md:p-6 lg:p-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
					Dashboard
				</h1>
				<p className="text-lg text-muted-foreground max-w-[600px]">
					Bienvenido de nuevo. Aquí tienes un resumen del estado actual de tu plataforma.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card to-muted/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Ingresos Totales
						</CardTitle>
						<div className="p-2 bg-primary/10 rounded-lg">
							<Icon name="layout-dashboard" className="size-4 text-primary" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">$45,231.89</div>
						<div className="flex items-center gap-1 mt-1">
							<Badge
								variant="secondary"
								className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-1 py-0 h-4"
							>
								<Icon name="arrow-right" className="size-3 -rotate-45" />
								20.1%
							</Badge>
							<span className="text-[10px] text-muted-foreground font-medium">vs. mes pasado</span>
						</div>
					</CardContent>
				</Card>

				<Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card to-muted/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Suscripciones
						</CardTitle>
						<div className="p-2 bg-primary/10 rounded-lg">
							<Icon name="users" className="size-4 text-primary" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">+2,350</div>
						<div className="flex items-center gap-1 mt-1">
							<Badge
								variant="secondary"
								className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-1 py-0 h-4"
							>
								<Icon name="arrow-right" className="size-3 -rotate-45" />
								180%
							</Badge>
							<span className="text-[10px] text-muted-foreground font-medium">vs. mes pasado</span>
						</div>
					</CardContent>
				</Card>

				<Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card to-muted/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Activos Ahora
						</CardTitle>
						<div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
							<Icon name="zap" className="size-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">+573</div>
						<div className="flex items-center gap-1 mt-1">
							<div className="size-2 rounded-full bg-amber-500 animate-pulse" />
							<span className="text-[10px] text-muted-foreground font-medium">Tiempo real</span>
						</div>
					</CardContent>
				</Card>

				<Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card to-muted/20">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Proyectos
						</CardTitle>
						<div className="p-2 bg-primary/10 rounded-lg">
							<Icon name="package" className="size-4 text-primary" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">+12</div>
						<div className="flex items-center gap-1 mt-1">
							<span className="text-[10px] text-muted-foreground font-medium">En desarrollo</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-full lg:col-span-4 border-primary/5">
					<CardHeader>
						<CardTitle>Vista General</CardTitle>
						<CardDescription>
							Actividad de ventas y usuarios en los últimos 30 días.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[350px] w-full flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border/50 transition-all hover:bg-muted/40 group">
							<div className="text-center space-y-2 translate-y-2 opacity-50 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
								<Icon name="chart-bar-big" className="size-8 mx-auto text-primary" />
								<p className="text-sm font-medium">Visualización de Datos</p>
								<p className="text-xs text-muted-foreground">
									Esperando conexión con el backend...
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-full lg:col-span-3 border-primary/5">
					<CardHeader>
						<CardTitle>Ventas Recientes</CardTitle>
						<CardDescription>Has realizado 265 ventas este mes.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{[
								{
									name: 'Izaack',
									email: 'izaack@ventura.com',
									amount: '+$1,999.00',
									initials: 'IZ',
								},
								{
									name: 'Olivia Martin',
									email: 'olivia.martin@email.com',
									amount: '+$1,999.00',
									initials: 'OM',
								},
								{
									name: 'Jackson Lee',
									email: 'jackson.lee@email.com',
									amount: '+$39.00',
									initials: 'JL',
								},
								{
									name: 'Isabella Nguyen',
									email: 'isabella.nguyen@email.com',
									amount: '+$299.00',
									initials: 'IN',
								},
								{ name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
							].map((user, i) => (
								<div
									key={i}
									className="flex items-center group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors"
								>
									<div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-primary/5 transition-all group-hover:scale-110">
										{user.initials}
									</div>
									<div className="ml-4 flex-1 min-w-0">
										<p className="text-sm font-semibold truncate group-hover:text-primary transition-colors leading-none mb-1">
											{user.name}
										</p>
										<p className="text-xs text-muted-foreground truncate leading-none">
											{user.email}
										</p>
									</div>
									<div className="ml-auto font-mono text-sm font-bold tracking-tighter text-emerald-500">
										{user.amount}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
