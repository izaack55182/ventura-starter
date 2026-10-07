import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components/ui/page'
import type { Route } from '@/rr/features/core/dashboard/routes/+types/dashboard'
import { getMeta } from '@/utils/seo/meta'

export const meta: Route.MetaFunction = ({ matches }) => {
	return getMeta({ title: 'Dashboard', matches, noIndex: true })
}

export default function Dashboard() {
	return (
		<Page variant="full">
			<PageHeader>
				<PageTitle>Dashboard</PageTitle>
				<PageDescription>
					Bienvenido de nuevo. Aquí tienes un resumen del estado actual de tu plataforma.
				</PageDescription>
			</PageHeader>
			<PageContent className="space-y-6 md:space-y-8">
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
									{
										name: 'William Kim',
										email: 'will@email.com',
										amount: '+$99.00',
										initials: 'WK',
									},
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
			</PageContent>
		</Page>
	)
}
