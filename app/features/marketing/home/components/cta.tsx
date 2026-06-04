import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { cn } from '@/utils/misc'
import { TECH_CARDS } from '../constants'

export function CTA() {
	return (
		<Container as="section" id="cta" variant="section" className="overflow-hidden">
			<div className="relative flex flex-col items-center gap-12 text-center w-full mx-auto">
				{/* Header */}
				<div className="grid w-full grid-cols-1 items-end gap-6 text-left md:grid-cols-2 md:gap-12">
					<motion.h2
						className="text-h4 md:text-h3 font-semibold tracking-tight text-foreground leading-tight"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55 }}
					>
						¿Listo para empezar con Ventura Stack?
					</motion.h2>

					<motion.p
						className="text-body-xs md:text-body-sm text-muted-foreground leading-relaxed md:text-right"
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.08 }}
					>
						Comienza a desarrollar con tu tecnología preferida y ten tu aplicación lista y
						desplegada en el Edge global en menos de dos minutos.
					</motion.p>
				</div>

				{/* Branded Tech Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
					{TECH_CARDS.map((tech, i) => (
						<motion.div
							key={tech.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.08 }}
							className="group relative flex h-[420px] md:h-[480px] flex-col justify-between overflow-hidden rounded-[24px] border border-border/40 p-7 text-left transition-transform duration-300 hover:-translate-y-1"
						>
							{/* Brand background */}
							<div className={tech.cardClass + ' absolute inset-0'} />

							{/* Logo tile (top-left) */}
							<div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
								<img
									src={tech.logo}
									alt={tech.name}
									className="h-7 w-7 object-contain select-none"
								/>
							</div>

							{/* Code snippet (center) */}
							<div
								className={cn(
									'relative z-10 rounded-2xl border p-4 font-mono text-[11px] leading-relaxed backdrop-blur-sm select-none',
									tech.code.boxClass
								)}
							>
								<div className={cn('mb-3', tech.code.mutedClass)}>{tech.code.label}</div>
								<div className="space-y-1">
									{tech.code.lines.map((line, li) => (
										<div key={li} className="whitespace-pre">
											{line.map(([text, kind], ti) => (
												<span
													key={ti}
													className={
														kind === 'accent'
															? tech.code.accentClass
															: kind === 'muted'
																? tech.code.mutedClass
																: tech.code.baseClass
													}
												>
													{text}
												</span>
											))}
										</div>
									))}
								</div>
							</div>

							{/* Name + description (bottom-left) */}
							<div className="relative z-10 space-y-1.5">
								<h3 className={'text-body-md font-semibold tracking-tight ' + tech.titleClass}>
									{tech.name}
								</h3>
								<p className={'text-body-2xs leading-relaxed ' + tech.descClass}>
									{tech.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Main CTA Button */}
				<div className="flex flex-col sm:flex-row gap-4 mt-2">
					<Button size="lg" variant="outline">
						Accesible Próximamente
					</Button>
				</div>
			</div>
		</Container>
	)
}
