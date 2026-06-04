import { motion } from 'motion/react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Container } from '@/components/ui/container'

export function BatteriesIncluded() {
	return (
		<Container as="section" id="batteries" variant="section" className="relative overflow-hidden">
			{/* Header */}
			<div className="flex flex-col gap-3 max-w-2xl mx-auto text-center mb-16 relative z-10 select-none">
				<motion.h2
					className="text-h2 md:text-h1 font-semibold tracking-tight text-foreground"
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					Baterías incluidas
				</motion.h2>
				<motion.p
					className="text-body-xs md:text-body-sm text-muted-foreground"
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.15 }}
				>
					Las herramientas esenciales que necesitas para construir, probar y desplegar tus
					aplicaciones están todas incluidas.
				</motion.p>
			</div>

			{/* Bento Grid (Asymmetric Bento Layout - 3 columns, high rows) */}
			<BentoGrid className="grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[30rem] md:auto-rows-[28rem]">
				{/* 1. React Router v7 (WIDER: col-span-2) */}
				<BentoCard
					name="React Router v7"
					className="md:col-span-2"
					Icon={
						<img
							src="/images/brands/reactrouter.svg"
							alt="React Router"
							className="w-5 h-5 object-contain"
						/>
					}
					description={
						<span className="block text-muted-foreground text-body-2xs md:text-body-xs leading-relaxed mt-2 select-none">
							Framework robusto con Loaders, Actions y Streaming en tiempo real. Tipado seguro de
							extremo a extremo nativo.
						</span>
					}
					background={
						<div className="w-full max-w-[95%] grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
							{/* Left: Loader */}
							<div className="bg-card-interactive border border-border rounded-lg p-4 font-mono text-xs sm:text-xs leading-relaxed text-left shadow-sm select-none">
								<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
									<span>app/routes/users.tsx</span>
									<span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-sans  font-bold">
										Loader
									</span>
								</div>
								<div>
									<span className="text-purple-600 dark:text-purple-400 font-medium">
										export async function
									</span>
									<span className="text-sky-600 dark:text-sky-400"> loader</span>
									<span className="text-muted-foreground">() {'{'}</span>
								</div>
								<div className="pl-4">
									<span className="text-sky-600 dark:text-sky-400">const</span>
									<span className="text-foreground"> users </span>
									<span className="text-muted-foreground">= </span>
									<span className="text-purple-600 dark:text-purple-400 font-medium">await</span>
									<span className="text-foreground"> db.query()</span>
								</div>
								<div className="pl-4">
									<span className="text-purple-600 dark:text-purple-400 font-medium">return</span>
									<span className="text-muted-foreground"> {'{ users }'}</span>
								</div>
								<div>
									<span className="text-muted-foreground">{'}'}</span>
								</div>
							</div>

							{/* Right: Component */}
							<div className="bg-card-interactive border border-border rounded-lg p-4 font-mono text-xs sm:text-xs leading-relaxed text-left shadow-sm select-none hidden md:block">
								<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
									<span>app/routes/users.tsx</span>
									<span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-sans font-bold">
										Component
									</span>
								</div>
								<div>
									<span className="text-purple-600 dark:text-purple-400 font-medium">
										export default function
									</span>
									<span className="text-sky-600 dark:text-sky-400"> Users</span>
									<span className="text-muted-foreground">() {'{'}</span>
								</div>
								<div className="pl-4">
									<span className="text-sky-600 dark:text-sky-400">const</span>
									<span className="text-muted-foreground"> {'{ users }'} </span>
									<span className="text-muted-foreground">= </span>
									<span className="text-sky-600 dark:text-sky-400">useLoaderData</span>
									<span className="text-zinc-550 dark:text-zinc-450">()</span>
								</div>
								<div className="pl-4">
									<span className="text-purple-600 dark:text-purple-400 font-medium">return</span>
									<span className="text-muted-foreground"> &lt;</span>
									<span className="text-blue-600 dark:text-blue-400">ul</span>
									<span className="text-zinc-550 dark:text-zinc-450">&gt;...&lt;/</span>
									<span className="text-blue-600 dark:text-blue-400">ul</span>
									<span className="text-zinc-550 dark:text-zinc-450">&gt;</span>
								</div>
								<div>
									<span className="text-muted-foreground">{'}'}</span>
								</div>
							</div>
						</div>
					}
				/>

				{/* 2. TypeScript E2E (NARROWER: col-span-1) */}
				<BentoCard
					name="TypeScript E2E"
					className="md:col-span-1"
					Icon={
						<img
							src="/images/brands/typescript.svg"
							alt="TypeScript"
							className="w-5 h-5 object-contain"
						/>
					}
					description={
						<span className="block text-muted-foreground text-body-2xs md:text-body-xs leading-relaxed mt-2 select-none">
							Seguridad total en tiempo de compilación y ejecución mediante validación estructurada
							con Zod.
						</span>
					}
					background={
						<div className="w-full max-w-[95%] bg-card-interactive border border-border rounded-lg p-4 font-mono text-xs sm:text-xs leading-relaxed text-left shadow-sm select-none mb-2">
							<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
								<span>models/user.ts</span>
								<span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-sans  font-bold">
									Zod
								</span>
							</div>
							<div>
								<span className="text-purple-600 dark:text-purple-400 font-medium">const</span>
								<span className="text-foreground"> userSchema </span>
								<span className="text-muted-foreground">= </span>
								<span className="text-sky-600 dark:text-sky-400">z</span>
								<span className="text-muted-foreground font-medium">.object({'{'}</span>
							</div>
							<div className="pl-4">
								<span className="text-orange-600 dark:text-orange-400">name</span>
								<span className="text-muted-foreground">: </span>
								<span className="text-sky-600 dark:text-sky-400">z</span>
								<span className="text-muted-foreground font-medium">.string(),</span>
							</div>
							<div className="pl-4">
								<span className="text-orange-600 dark:text-orange-400">email</span>
								<span className="text-muted-foreground">: </span>
								<span className="text-sky-600 dark:text-sky-400">z</span>
								<span className="text-muted-foreground font-medium">.string().email(),</span>
							</div>
							<div>
								<span className="text-muted-foreground">{'}'})</span>
							</div>
						</div>
					}
				/>

				{/* 3. Workers Middleware (NARROWER: col-span-1) */}
				<BentoCard
					name="Workers Middleware"
					className="md:col-span-1"
					Icon={
						<img
							src="/images/brands/cloudflare.svg"
							alt="Cloudflare Workers"
							className="w-5 h-5 object-contain"
						/>
					}
					description={
						<span className="block text-muted-foreground text-body-2xs md:text-body-xs leading-relaxed mt-2 select-none">
							Middleware nativo en el Worker para interceptar, validar y optimizar peticiones en el
							Edge.
						</span>
					}
					background={
						<div className="w-full max-w-[95%] bg-card-interactive border border-border rounded-lg p-4 font-mono text-xs sm:text-xs leading-relaxed text-left shadow-sm select-none mb-2">
							<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
								<span>workers/app.ts</span>
								<span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded font-sans  font-bold text-center">
									Middleware
								</span>
							</div>
							<div>
								<span className="text-purple-600 dark:text-purple-400 font-medium">
									export default
								</span>
								<span className="text-muted-foreground">{` {`}</span>
							</div>
							<div className="pl-4">
								<span className="text-purple-600 dark:text-purple-400 font-medium">async</span>
								<span className="text-sky-600 dark:text-sky-400"> fetch</span>
								<span className="text-muted-foreground">(req, env) {'{'}</span>
							</div>
							<div className="pl-8">
								<span className="text-sky-600 dark:text-sky-400">const</span>
								<span className="text-foreground"> start </span>
								<span className="text-muted-foreground">= </span>
								<span className="text-sky-600 dark:text-sky-400">Date</span>
								<span className="text-foreground">.now()</span>
							</div>
							<div className="pl-8">
								<span className="text-zinc-700 dark:text-zinc-300">response.headers.set(</span>
								<span className="text-orange-600 dark:text-orange-400">'X-Time'</span>
								<span className="text-muted-foreground">, ...)</span>
							</div>
							<div>
								<span className="text-muted-foreground">{'}'}</span>
							</div>
						</div>
					}
				/>

				{/* 4. Biome Linter (WIDER: col-span-2) */}
				<BentoCard
					name="Biome Linter"
					className="md:col-span-2"
					Icon={
						<img src="/images/brands/biomejs.svg" alt="Biome" className="w-5 h-5 object-contain" />
					}
					description={
						<span className="block text-muted-foreground text-body-2xs md:text-body-xs leading-relaxed mt-2 select-none">
							Formateador y linter ultra-rápido en Rust que unifica herramientas para un feedback
							instantáneo.
						</span>
					}
					background={
						<div className="w-full max-w-[95%] grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
							{/* Left: Linter execution */}
							<div className="bg-card-interactive border border-border rounded-lg p-4 font-mono text-xs sm:text-xs leading-relaxed text-left shadow-sm select-none">
								<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
									<span>Terminal</span>
									<span className="text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded font-sans  font-bold">
										Command
									</span>
								</div>
								<div>
									<span className="text-muted-foreground font-semibold">$ </span>
									<span className="text-sky-600 dark:text-sky-400 font-medium">biome</span>
									<span className="text-muted-foreground"> check --fix</span>
								</div>
								<div className="mt-2 text-muted-foreground leading-snug">
									<span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
										✓
									</span>{' '}
									Checked 42 files in 140ms
								</div>
								<div className="text-muted-foreground mt-1">
									<span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
										✓
									</span>{' '}
									Formatted 2 files
								</div>
							</div>

							{/* Right: Mock Rounded Code Skeletons (Deno Code Linter style!) */}
							<div className="bg-card-interactive border border-border rounded-lg p-4 flex flex-col justify-between shadow-sm select-none hidden md:flex">
								<div className="text-muted-foreground text-[10px] sm:text-[10px] mb-2.5 font-mono border-b border-border/60 pb-1.5 flex items-center justify-between">
									<span>Linter Analysis</span>
									<span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-sans  font-bold font-mono">
										Passed
									</span>
								</div>
								{/* Rounded skeleton bars representing parsed file rows */}
								<div className="flex flex-col gap-2.5 my-1">
									<div className="flex gap-2 items-center">
										<span className="h-1.5 w-12 rounded-full bg-emerald-500/80" />
										<span className="h-1.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
									</div>
									<div className="flex gap-2 items-center">
										<span className="h-1.5 w-8 rounded-full bg-emerald-500/80" />
										<span className="h-1.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
									</div>
									<div className="flex gap-2 items-center">
										<span className="h-1.5 w-16 rounded-full bg-amber-500/80" />
										<span className="h-1.5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
									</div>
									<div className="flex gap-2 items-center">
										<span className="h-1.5 w-10 rounded-full bg-emerald-500/80" />
										<span className="h-1.5 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
									</div>
								</div>
							</div>
						</div>
					}
				/>
			</BentoGrid>
		</Container>
	)
}
