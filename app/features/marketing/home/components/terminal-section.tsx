import { motion } from 'motion/react'
import { Container } from '@/components/ui/container'
import { PILLARS } from '../constants'

export function TerminalSection() {
	return (
		<Container as="section" id="terminal" variant="section">
			<div className="flex flex-col gap-16 md:gap-20 w-full select-none relative z-10">
				{/* Header — title left, copy right */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start text-left">
					<motion.h2
						className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55 }}
					>
						Por qué los equipos construyen sobre Ventura
					</motion.h2>

					<motion.p
						className="text-body-md md:text-body-lg text-muted-foreground leading-relaxed"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55, delay: 0.1 }}
					>
						Ventura reemplaza los stacks heredados con un sistema rápido y nativo del Edge, diseñado
						para el desarrollo de productos moderno.
					</motion.p>
				</div>

				{/* Architecture diagram card */}
				<motion.div
					className="w-full rounded-2xl p-4 md:p-8 overflow-hidden"
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.15 }}
				>
					<img
						src="/images/architecture.webp"
						alt="Diagrama de arquitectura de Ventura Stack"
						className="w-full h-auto object-contain"
					/>
				</motion.div>

				{/* Bottom pillars */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
					{PILLARS.map((pillar, i) => (
						<motion.div
							key={pillar.title}
							className="flex flex-col gap-2"
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.45, delay: i * 0.1 }}
						>
							<h3 className="text-body-sm md:text-body-md font-semibold text-foreground tracking-tight">
								{pillar.title}
							</h3>
							<p className="text-body-xs md:text-body-sm text-muted-foreground leading-relaxed">
								{pillar.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</Container>
	)
}
