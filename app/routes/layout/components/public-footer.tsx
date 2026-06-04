import { Link } from 'react-router'
import { ColorSchemeSwitch } from '@/components/color-scheme-switch'
import { Icon } from '@/components/ui/icon'
import Logo from './logo'

export function Footer() {
	return (
		<footer className="w-full border-t border-border bg-transparent py-16 text-left select-none relative overflow-hidden">
			{/* Background Image centered behind footer */}
			<div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-10 dark:opacity-40">
				<img
					src="/images/backgrounds/background-blue-sky.webp"
					alt=""
					className="w-full h-full object-cover object-center"
				/>
			</div>
			<div className="container mx-auto px-6 max-w-[1240px] relative z-10">
				{/* Top Grid: Brand Column + 2 Links Columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-border pb-12 mb-10">
					{/* Col 1: Brand details & Theme Selector */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2 text-foreground font-bold text-lg">
							<Logo variant="icon" className="size-8" />
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
							El stack de desarrollo definitivo optimizado para el Edge Global.
						</p>
						<div className="mt-2 w-fit">
							<ColorSchemeSwitch />
						</div>
					</div>

					{/* Col 2: Open-source components */}
					<div className="flex flex-col gap-3">
						<h4 className="text-sm font-bold text-foreground">Open-source</h4>
						<ul className="space-y-2 text-xs font-semibold text-muted-foreground">
							<li>
								<a
									href="https://reactrouter.com"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									React Router v7
								</a>
							</li>
							<li>
								<a
									href="https://workers.cloudflare.com"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									Cloudflare Workers
								</a>
							</li>
							<li>
								<a
									href="https://bun.sh"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									Bun Runtime
								</a>
							</li>
							<li>
								<a
									href="https://biomejs.dev"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									Biome Linter
								</a>
							</li>
						</ul>
					</div>

					{/* Col 3: Stack Sections */}
					<div className="flex flex-col gap-3">
						<h4 className="text-sm font-bold text-foreground">Stack</h4>
						<ul className="space-y-2 text-xs font-semibold text-muted-foreground">
							<li>
								<Link to="/#runtime" className="hover:text-foreground transition-colors">
									Runtime
								</Link>
							</li>
							<li>
								<Link to="/#use-cases" className="hover:text-foreground transition-colors">
									Casos de Uso
								</Link>
							</li>
							<li>
								<Link to="/#batteries" className="hover:text-foreground transition-colors">
									Baterías
								</Link>
							</li>
							<li>
								<Link to="/#deploy" className="hover:text-foreground transition-colors">
									Despliegues
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar: Clean centered Copyright */}
				<div className="flex items-center justify-center text-xs text-muted-foreground">
					<span className="font-medium select-none text-center">
						Copyright © 2026 Ventura. Todos los derechos reservados.
					</span>
				</div>
			</div>
		</footer>
	)
}
