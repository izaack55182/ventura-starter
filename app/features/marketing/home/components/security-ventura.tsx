import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import { SECURITY_FEATURES } from '../constants'

export function SecurityVentura() {
	return (
		<Container as="section" className="py-24 md:py-32">
			<div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-24">
				<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
					Seguridad desde el primer día
				</h2>
				<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
					No dejes la seguridad como un pensamiento de última hora. Ventura Stack incluye las
					mejores prácticas de la industria configuradas por defecto para que te enfoques en
					construir.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
				{SECURITY_FEATURES.map((feature, i) => (
					<div
						key={i}
						className="flex flex-col gap-2 p-8 md:p-10 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors shadow-sm"
					>
						<div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-4 border border-border/50">
							<Icon name={feature.icon as any} size="lg" />
						</div>
						<h3 className="text-2xl font-semibold tracking-tight text-foreground">
							{feature.title}
						</h3>
						<p className="text-muted-foreground leading-relaxed mt-2">{feature.description}</p>
					</div>
				))}
			</div>
		</Container>
	)
}
