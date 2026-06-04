import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import { EdgeActivity } from './edge-activity'

export function Deploy() {
	return (
		<Container as="section" id="deploy" variant="section" className="relative overflow-hidden">
			{/* Bottom Grid Layout - Left Copy, Right Mockup Card */}
			<div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full relative z-10">
				{/* Left Column: Copy */}
				<div className="flex flex-col gap-6 text-left max-w-xl">
					<span className="text-body-2xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
						Deploy & Previews
					</span>

					<h3 className="text-4xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.05] tracking-tight">
						Despliegues automáticos, builds y previews.
					</h3>

					<p className="text-body-sm md:text-body-md leading-relaxed text-muted-foreground">
						<span className="font-semibold text-foreground">
							Integraciones automáticas con GitHub y builds optimizados por Bun.
						</span>{' '}
						Dominios de vista previa para cada Pull Request, configuración de variables de entorno y
						mucho más.
					</p>

					<a
						href="#cta"
						className="group mt-1 inline-flex items-center gap-2 text-body-xs font-medium text-foreground/90 transition-colors hover:text-foreground"
					>
						<Icon name="git-branch" size="sm" className="text-blue-500" />
						Preview por cada Pull Request
						<span className="transition-transform duration-300 group-hover:translate-x-0.5">›</span>
					</a>
				</div>

				<EdgeActivity />
			</div>
		</Container>
	)
}
