import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/utils/misc'
import { BENCHMARK_DATA, type BenchmarkTab, STATS } from '../constants'

// --- Main Section Component ---

export function Runtime() {
	const [activeTab, setActiveTab] = useState<BenchmarkTab>('postgres')
	const [hoveredTab, setHoveredTab] = useState<BenchmarkTab | null>(null)

	const currentBenchmark = BENCHMARK_DATA[activeTab]

	return (
		<Container as="section" id="runtime" variant="section" className="relative">
			{/* Bottom Grid Layout - Left Copy, Right Interactive Benchmark */}
			<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full mt-16 text-left relative z-10">
				{/* Left Column: Feature points (5 cols) */}
				<div className="lg:col-span-5 flex flex-col gap-8">
					<div className="space-y-3">
						<h2 className="text-h3 md:text-h2 font-semibold tracking-tight text-foreground leading-tight">
							El runtime de Javascript, reinventado.
						</h2>
					</div>

					<p className="text-body-sm md:text-body-md text-muted-foreground leading-relaxed">
						Ventura Stack corre de forma nativa sobre **Bun**. Al evitar el overhead histórico de
						Node.js.
					</p>

					{/* Bullet Features */}
					<ul className="flex flex-col gap-4">
						{[
							{
								title: 'HMR instantáneo y sin fricciones',
							},
							{
								title: 'Concurrencia extrema en Edge',
							},
							{
								title: 'Consumo ultra-bajo de RAM',
							},
						].map((feat, i) => (
							<motion.li
								key={i}
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								className="flex items-start gap-3"
							>
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 mt-0.5 flex-shrink-0">
									<Icon name="circle-check" size="xs" />
								</span>
								<div>
									<h4 className="text-body-xs font-semibold text-foreground leading-snug">
										{feat.title}
									</h4>
								</div>
							</motion.li>
						))}
					</ul>
				</div>

				{/* Right Column: Interactive Benchmark (7 cols) */}
				<div className="lg:col-span-7 w-full flex flex-col gap-5">
					{/* Minimalist Tab Selectors */}
					<div className="flex p-1 rounded-lg w-full max-w-lg mx-auto md:mx-0 overflow-x-auto no-scrollbar ring-1 ring-white/5">
						{(Object.keys(BENCHMARK_DATA) as BenchmarkTab[]).map((tabKey) => {
							const isSelected = activeTab === tabKey
							const label = BENCHMARK_DATA[tabKey].label

							return (
								<button
									type="button"
									key={tabKey}
									onClick={() => setActiveTab(tabKey)}
									onMouseEnter={() => setHoveredTab(tabKey)}
									onMouseLeave={() => setHoveredTab(null)}
									className={cn(
										'relative px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-300 flex-1 whitespace-nowrap text-center outline-none select-none cursor-pointer z-10',
										isSelected ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
									)}
								>
									{/* Active Pill Background */}
									{isSelected && (
										<motion.div
											layoutId="activeTabPill"
											className="absolute inset-0 bg-zinc-800 rounded-md shadow-sm ring-1 ring-white/10"
											transition={{ type: 'spring', stiffness: 400, damping: 30 }}
										/>
									)}
									<span className="relative z-10">{label}</span>
								</button>
							)
						})}
					</div>

					{/* Benchmark Card */}
					<div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
						{/* Subtle top glow line */}
						<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

						{/* Header Information */}
						<div className="space-y-2 z-10">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeTab}
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 5 }}
									transition={{ duration: 0.25 }}
								>
									<h3 className="text-body-xs md:text-body-sm font-bold text-white tracking-tight flex items-center gap-2">
										{currentBenchmark.title}
									</h3>
									<p className="text-[10px] md:text-body-2xs text-muted-foreground/80 font-medium">
										{currentBenchmark.subtitle}
									</p>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Minimalist Leaderboard List */}
						<div className="flex flex-col gap-5 mt-8 mb-6 z-10 w-full max-w-sm mx-auto md:mx-0">
							<AnimatePresence mode="popLayout">
								<motion.div
									key={activeTab}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.3 }}
									className="flex flex-col gap-4"
								>
									{currentBenchmark.competitors
										.slice()
										.sort((a, b) => b.value - a.value)
										.map((comp, index) => {
											// Colors from the image: Blue, Teal, Green
											const colorClass =
												index === 0
													? 'bg-[#3b82f6]' // Blue
													: index === 1
														? 'bg-[#14b8a6]' // Teal
														: 'bg-[#22c55e]' // Green

											return (
												<div key={comp.name} className="flex items-center justify-between group">
													<div className="flex items-center gap-4">
														<span className="text-muted-foreground/60 font-mono text-sm w-4 text-right">
															{index + 1}
														</span>
														<div className={cn('w-2.5 h-2.5 rounded-full', colorClass)} />
														<div className="flex items-center gap-2">
															<span className="font-medium text-foreground text-sm md:text-base tracking-wide">
																{comp.name}
															</span>
															{/* Version visible on hover or always if preferred, let's keep it subtle */}
															<span className="text-[10px] text-muted-foreground/40 font-mono hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity">
																{comp.version}
															</span>
														</div>
													</div>
													<div className="flex items-center gap-1.5">
														<span className="font-mono text-sm md:text-base text-muted-foreground/80">
															{comp.formattedValue}
														</span>
														<span className="text-[10px] text-muted-foreground/40 font-mono">
															{currentBenchmark.unit}
														</span>
													</div>
												</div>
											)
										})}
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Footer Link */}
						<div className="mt-8 pt-3 border-t border-border/10 flex justify-center items-center z-10">
							<a
								href="#deploy"
								className="text-body-2xs font-mono text-muted-foreground flex items-center gap-1 group"
							>
								Ver detalles de despliegue
								<motion.span
									className="inline-block"
									animate={{ x: [0, 3, 0] }}
									transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
								>
									→
								</motion.span>
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* ── Por qué construir sobre Ventura — value props + stats ── */}
			<div className="flex flex-col gap-8 w-full select-none mt-24 md:mt-32 pt-16 border-t border-border/40">
				{/* Header — two-column editorial layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start text-left">
					{/* Left: Big headline */}
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-h2 md:text-h1 font-semibold tracking-tight text-foreground leading-[1.05]"
					>
						Por qué construir sobre Ventura
					</motion.h2>

					{/* Right: Lead copy + stats */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex flex-col gap-8"
					>
						<div className="space-y-5">
							<p className="text-body-md md:text-body-lg leading-relaxed text-muted-foreground">
								<span className="text-foreground font-medium">
									El stack moderno corre nativo sobre Bun y el Edge.
								</span>{' '}
								Pero los stacks tradicionales arrastran el overhead de Node, dejando tus apps lentas
								y difíciles de escalar.
							</p>
							<p className="text-body-xs md:text-body-sm leading-relaxed text-muted-foreground/70 max-w-md">
								Ventura Stack está diseñado para esta nueva realidad: aislamiento total, rendimiento
								óptimo en el Edge y control absoluto desde el primer commit.
							</p>
						</div>

						{/* Stats list */}
						<div className="flex flex-col divide-y divide-border/40">
							{STATS.map((stat, i) => (
								<motion.div
									key={stat.value}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
									className="flex items-baseline gap-6 py-4"
								>
									<span className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground tabular-nums w-20 shrink-0">
										{stat.value}
									</span>
									<span className="text-body-xs md:text-body-sm text-muted-foreground">
										{stat.label}
									</span>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>

				{/* TypeScript Integration Mockup Block */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full mt-24 md:mt-32 pt-16  text-left">
					{/* Left: Single Clean Code Card (Replacing multiple overlapping terminals) */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="w-full max-w-lg mx-auto lg:mx-0 pr-0 pb-0"
					>
						{/* Clean Dark Code Card Wrapper (No headers, pure code) */}
						<div className="w-full bg-card border border-border rounded-2xl p-6 shadow-md font-mono text-xs sm:text-xs leading-relaxed text-left relative overflow-hidden select-none">
							<div className="flex flex-col gap-1 text-foreground leading-normal">
								<div>
									<span className="text-purple-600 dark:text-purple-400 font-medium">type</span>{' '}
									<span className="text-sky-600 dark:text-sky-400">User</span> = &#123; name:{' '}
									<span className="text-orange-600 dark:text-orange-400">string</span>; balance:{' '}
									<span className="text-orange-600 dark:text-orange-400">number</span> &#125;;
								</div>
								<div className="mt-1.5">
									<span className="text-purple-600 dark:text-purple-400 font-medium">function</span>{' '}
									<span className="text-yellow-600 dark:text-yellow-400 font-medium">
										getBalance
									</span>
									<span className="text-muted-foreground">(</span>
									user: <span className="text-sky-600 dark:text-sky-400">User</span>
									<span className="text-muted-foreground">):</span>{' '}
									<span className="text-orange-600 dark:text-orange-400">string</span> &#123;
								</div>
								<div className="pl-4">
									<span className="text-purple-600 dark:text-purple-400 font-medium">return</span>{' '}
									<span className="text-emerald-600 dark:text-emerald-400">
										`Balance: $$&#123;user.balance.toFixed(2)&#125;`
									</span>
									;
								</div>
								<div>&#125;</div>
								<div className="mt-2.5">
									<span className="text-sky-600 dark:text-sky-400">console</span>.
									<span className="text-yellow-600 dark:text-yellow-400 font-medium">log</span>
									<span className="text-muted-foreground">(</span>
									<span className="text-yellow-600 dark:text-yellow-400 font-medium font-mono">
										getBalance
									</span>
									<span className="text-muted-foreground">(&#123;</span> name:{' '}
									<span className="text-emerald-600 dark:text-emerald-400">"Alice"</span>, balance:{' '}
									<span className="text-orange-600 dark:text-orange-400">42</span>{' '}
									<span className="text-muted-foreground">&#125;));</span>
								</div>
								<div className="mt-3.5 border-t border-border pt-2 text-muted-foreground font-mono text-[10px] uppercase tracking-wide">
									{'// Output: Balance: $42.00'}
								</div>
							</div>
						</div>
					</motion.div>

					{/* Right: Marketing Copy + CTA */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex flex-col gap-6"
					>
						<div className="flex items-center gap-3.5">
							<h3 className="text-h2 md:text-h1 font-semibold tracking-tight text-foreground inline-flex items-center gap-3.5 select-none">
								Solo Corre
								<img
									src="/images/brands/typescript.svg"
									alt="TypeScript Logo"
									className="w-10 h-10 md:w-12 md:h-12 object-contain select-none shrink-0"
								/>
							</h3>
						</div>
						<p className="text-muted-foreground text-body-xs md:text-body-sm leading-relaxed max-w-lg">
							Ejecuta archivos .ts y .tsx al instante con soporte nativo y compilación en tiempo
							real en Bun. Sin loaders, sin dependencias pesadas ni configuraciones complejas.
							¡Simplemente funciona!
						</p>
						<Button size="lg" variant="outline" className="w-fit">
							Más sobre TypeScript en Bun
							<span className="font-mono ml-1.5">&gt;</span>
						</Button>
					</motion.div>
				</div>
			</div>
		</Container>
	)
}
