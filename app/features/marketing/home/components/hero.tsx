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
			className="relative overflow-hidden flex flex-col items-center justify-center min-h-[75svh] md:min-h-[85svh] text-center px-4 sm:px-6"
		>
			<div className="absolute inset-0 z-0">
				<WavyBackground />
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
			</div>

			<div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full mt-6 md:mt-10 lg:mt-16">
				<div className="mb-4 md:mb-6 flex flex-col items-center">
					<Logo variant="long" className="w-44 sm:w-56 md:w-64 lg:w-80 h-auto mb-4 md:mb-6" />
					<h1 className="text-3xl sm:text-4xl md:text-h1 lg:text-mega tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 leading-tight">
						El Stack de React para la Web
					</h1>
				</div>

				{/* ── 2. Subtitle ── */}
				<p className="text-base sm:text-lg md:text-xl text-foreground max-w-[90%] sm:max-w-[600px] md:max-w-[750px] leading-relaxed mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
					Usado por desarrolladores alrededor del mundo, Ventura te permite crear{' '}
					<span className="font-semibold text-foreground">
						aplicaciones web de alto rendimiento
					</span>{' '}
					con el poder de React Router y Cloudflare.
				</p>

				{/* ── 3. CTAs ── */}
				<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
					<Button size="lg" className="w-full sm:w-auto">
						Comenzar
					</Button>
					<Button size="lg" variant="secondary" className="w-full sm:w-auto">
						Documentación
					</Button>
				</div>

				{/* ── 4. Terminal snippet ── */}
				<div className="mt-8 md:mt-14 text-xs sm:text-sm text-foreground font-mono animate-in fade-in duration-1000 delay-700 flex items-center gap-2 sm:gap-3 opacity-80 hover:opacity-100 transition-opacity max-w-full overflow-x-auto">
					<span className="text-foreground shrink-0">▲</span>
					<span className="truncate">~ bun create ventura-app@latest</span>
				</div>

				{/* ── 6. Logo Cloud ── */}
			</div>
		</Container>
	)
}
