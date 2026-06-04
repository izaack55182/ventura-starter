import { WavyBackground } from '@/components/ui/animation/wavy-background'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Logo from '@/routes/layout/components/logo'

export function Hero() {
	return (
		<Container
			as="section"
			id="hero"
			variant="section"
			className="relative overflow-hidden flex flex-col items-center justify-center min-h-[85svh] text-center"
		>
			{/* ── Fondo animado de ondas verticales ── */}
			<div className="absolute inset-0 z-0">
				<WavyBackground />
				{/* Difuminado en los bordes para fundir con la página */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
			</div>

			<div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full mt-10 md:mt-16">
				{/* ── 1. Main Heading ── */}
				<div className="mb-6 flex flex-col items-center">
					<Logo variant="long" className="w-64 md:w-80 h-auto mb-6" />
					<h1 className="text-h1 md:text-mega tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
						El Stack de React para la Web
					</h1>
				</div>

				{/* ── 2. Subtitle ── */}
				<p className="text-lg md:text-xl text-foreground max-w-[750px] leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
					Usado por desarrolladores alrededor del mundo, Ventura te permite crear{' '}
					<span className="font-semibold text-foreground">
						aplicaciones web de alto rendimiento
					</span>{' '}
					con el poder de React Router y Cloudflare.
				</p>

				{/* ── 3. CTAs ── */}
				<div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
					<Button size="lg">Comenzar</Button>
					<Button size="lg" variant="secondary">
						Documentación
					</Button>
				</div>

				{/* ── 4. Terminal snippet ── */}
				<div className="mt-10 md:mt-14 text-sm md:text-sm text-foreground font-mono animate-in fade-in duration-1000 delay-700 flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
					<span className="text-foreground">▲</span>
					<span>~ bun create ventura-app@latest</span>
				</div>

				{/* ── 6. Logo Cloud ── */}
			</div>
		</Container>
	)
}
