import { motion } from 'motion/react'
import { WavyBackground } from '@/components/ui/animation/wavy-background'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import Logo from '@/routes/layout/components/logo'

const BRANDS = [
	{ name: 'Bun', src: '/images/brands/bun.svg', alt: '', bg: '#fbf0df', text: '#000000' },
	{
		name: 'React Router',
		src: '/images/brands/reactrouter.svg',
		alt: '',
		bg: '#CA4245',
		text: '#ffffff',
	},
	{
		name: 'TypeScript',
		src: '/images/brands/typescript.svg',
		alt: '',
		bg: '#3178C6',
		text: '#ffffff',
	},
	{ name: 'Vitest', src: '/images/brands/vitest.svg', alt: '', bg: '#FCC72B', text: '#000000' },
	{
		name: 'Cloudflare Workers',
		src: '/images/brands/cloudflare.svg',
		alt: '',
		bg: '#F38020',
		text: '#ffffff',
	},
	{ name: 'Biome', src: '/images/brands/biomejs.svg', alt: '', bg: '#60A5FA', text: '#000000' },
	{ name: 'Zod', src: '/images/brands/zod.svg', alt: '', bg: '#3068B7', text: '#ffffff' },
	{
		name: 'Tailwind CSS',
		src: '/images/brands/tailwindcss.svg',
		alt: '',
		bg: '#38BDF8',
		text: '#000000',
	},
]

export function Hero() {
	return (
		<Container as="section" id="hero" variant="section">
			<div className="absolute inset-0 z-0">
				<WavyBackground />
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
			</div>

			<div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full mt-6 md:mt-10 lg:mt-16">
				<div className="mb-4 md:mb-6 flex flex-col items-center">
					<Logo variant="long" className="w-44 sm:w-56 md:w-64 lg:w-80 h-auto mb-4 md:mb-6" />
					<h1 className="text-xl sm:text-2xl md:text-h2 lg:text-h1 tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 leading-tight">
						El Stack de React para la Web
					</h1>
				</div>

				{/* ── 2. Subtitle ── */}
				<p className="text-base sm:text-lg md:text-xl text-foreground text-center leading-relaxed mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
					Ventura te permite crear{' '}
					<span className="font-bold text-foreground">aplicaciones web de alto rendimiento</span>{' '}
					<br />
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
				<motion.span
					className="text-[10px] sm:text-xs font-semibold text-zinc-450 mt-10 sm:mt-16 block"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					— Ventura funciona con —
				</motion.span>

				<TooltipProvider>
					<motion.div
						className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 w-full px-4"
						variants={{
							hidden: { opacity: 0 },
							show: {
								opacity: 1,
								transition: {
									staggerChildren: 0.1,
									delayChildren: 0.25,
								},
							},
						}}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						{BRANDS.map((brand) => (
							<Tooltip key={brand.name}>
								<TooltipTrigger asChild>
									<motion.div
										variants={{
											hidden: { opacity: 0, scale: 0.8, y: 15 },
											show: {
												opacity: 1,
												scale: 1,
												y: 0,
												transition: { type: 'spring', stiffness: 300, damping: 20 },
											},
										}}
										className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-card border border-border shadow-md transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:border-zinc-350 dark:hover:border-zinc-700 cursor-default"
									>
										<img
											src={brand.src}
											alt={brand.alt}
											className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
										/>
									</motion.div>
								</TooltipTrigger>
								<TooltipContent
									style={
										{
											backgroundColor: brand.bg,
											color: brand.text,
											'--tooltip-bg': brand.bg,
										} as React.CSSProperties
									}
									className="[&>svg]:!fill-[var(--tooltip-bg)] [&>svg]:!bg-[var(--tooltip-bg)] border-none font-semibold shadow-lg"
								>
									{brand.name}
								</TooltipContent>
							</Tooltip>
						))}
					</motion.div>
				</TooltipProvider>

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
