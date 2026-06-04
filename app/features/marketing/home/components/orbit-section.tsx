import { motion } from 'motion/react'
import { Container } from '@/components/ui/container'

export function OrbitSection() {
	const BRANDS = [
		{ name: 'Bun', src: '/images/brands/bun.svg' },
		{ name: 'React Router', src: '/images/brands/reactrouter.svg' },
		{ name: 'TypeScript', src: '/images/brands/typescript.svg' },
		{ name: 'Vitest', src: '/images/brands/vitest.svg' },
		{ name: 'Cloudflare Workers', src: '/images/brands/cloudflare.svg' },
		{ name: 'Biome', src: '/images/brands/biomejs.svg' },
		{ name: 'Zod', src: '/images/brands/zod.svg' },
		{ name: 'Tailwind CSS', src: '/images/brands/tailwindcss.svg' },
	]

	return (
		<Container as="section" id="tech-orbit" variant="section" className="relative overflow-hidden">
			<div className="flex flex-col items-center text-center max-w-4xl mx-auto py-8 select-none relative z-10">
				{/* 1. Large Title */}
				<motion.h2
					className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground"
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					Construido para el ecosistema moderno
				</motion.h2>

				{/* 2. Description */}
				<motion.p
					className="text-body-sm md:text-body-md text-muted-foreground max-w-2xl mt-5 leading-relaxed"
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.15 }}
				>
					Ya sea que despliegues en microservicios serverless, plataformas Edge ultra-rápidas o
					bases de datos distribuidas a nivel global, Ventura optimiza tu velocidad.
				</motion.p>

				{/* 3. Sub-header separator */}
				<motion.span
					className="text-[10px] sm:text-xs font-semibold text-zinc-450 mt-16 block"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					— Ventura funciona con —
				</motion.span>

				{/* 4. Circular Brand Badges list */}
				<motion.div
					className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 w-full px-4"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					{BRANDS.map((brand) => (
						<div
							key={brand.name}
							className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-card border border-border shadow-md transition-all duration-300 hover:scale-105 hover:border-zinc-350 dark:hover:border-zinc-700"
							title={brand.name}
						>
							<img
								src={brand.src}
								alt={brand.name}
								className={`w-7 h-7 sm:w-8 sm:h-8 object-contain`}
							/>
						</div>
					))}
				</motion.div>
			</div>
		</Container>
	)
}
