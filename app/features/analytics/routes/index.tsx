import type { MetaFunction } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon'
import { cn, getMeta } from '@/utils/misc'

export async function loader() {
	return {}
}

export default function Analytics() {
	return (
		<div className="space-y-8 p-6 lg:p-8">
			{/* ... Rest of your component */}
			<div className="space-y-2">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
					Analytics
				</h1>
				<p className="text-lg text-muted-foreground max-w-[600px]">
					Explora el rendimiento de tu negocio con métricas detalladas y visualizaciones.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{[
					{
						label: 'Vistas de Página',
						value: '45.2k',
						growth: '+12.5%',
						icon: 'layout-dashboard',
						color: 'text-blue-500',
					},
					{
						label: 'Tiempo de Sesión',
						value: '4m 32s',
						growth: '+4.1%',
						icon: 'zap',
						color: 'text-amber-500',
					},
					{
						label: 'Bounce Rate',
						value: '32.1%',
						growth: '-2.4%',
						icon: 'arrow-right',
						color: 'text-emerald-500',
					},
				].map((stat, i) => (
					<Card
						key={i}
						className="border-primary/5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
								{stat.label}
							</CardTitle>
							<Icon name={stat.icon as IconName} className={cn('size-4', stat.color)} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<div className="flex items-center gap-1 mt-1">
								<Badge
									variant="secondary"
									className="bg-primary/10 text-primary border-primary/20 px-1 py-0 h-4"
								>
									{stat.growth}
								</Badge>
								<span className="text-[10px] text-muted-foreground">vs. periodo anterior</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="border-primary/5">
				<CardHeader>
					<CardTitle>Rendimiento Histórico</CardTitle>
					<CardDescription>Visualización comparativa de tráfico y conversiones.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] w-full flex flex-col items-center justify-center rounded-xl bg-muted/20 border border-dashed border-border/50 transition-all hover:bg-muted/30">
						<div className="p-4 bg-background border border-border/50 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in zoom-in duration-500">
							<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
								<Icon name="chart-bar-big" className="size-5" />
							</div>
							<div className="space-y-1 pr-4">
								<p className="text-sm font-semibold">Integrando con Google Analytics...</p>
								<p className="text-xs text-muted-foreground">
									Los gráficos se cargarán al conectar tu cuenta.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ matches, location }: any) => {
	return getMeta({
		title: 'Analytics',
		description: 'Métricas y rendimiento en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}
