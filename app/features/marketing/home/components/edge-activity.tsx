import { cn } from '@/utils/misc'

export function EdgeActivity() {
	return (
		<div className="w-full flex items-center justify-center p-1">
			{/* Main Mockup Card Wrapper */}
			<div className="w-full max-w-[620px] bg-card border border-border rounded-2xl p-6 shadow-md text-left select-none relative overflow-hidden">
				{/* 1. Provider Tabs (GitHub / GitLab) */}
				<div className="flex gap-6 border-b border-border pb-3 mb-5 text-xs font-bold select-none relative">
					<span className="flex items-center gap-2 text-zinc-900 dark:text-white border-b-2 border-[#2b8ef0] pb-3 -mb-[14px]">
						{/* GitHub Brand Image */}
						<img
							src="/images/brands/github_light.svg"
							alt="GitHub"
							className="w-4 h-4 object-contain dark:invert"
						/>
						GitHub
					</span>
					<span className="flex items-center gap-2 text-muted-foreground hover:text-zinc-650 dark:hover:text-zinc-450 cursor-pointer transition-colors">
						{/* GitLab Brand Image */}
						<img src="/images/brands/gitlab.svg" alt="GitLab" className="w-4 h-4 object-contain" />
						GitLab
					</span>
				</div>

				{/* 2. Account Selector */}
				<div className="space-y-1.5 mb-5">
					<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
						Cuenta de GitHub
					</span>
					<div className="inline-flex items-center justify-between min-w-[220px] px-3 py-1.5 bg-card-interactive border border-border rounded-lg shadow-sm">
						<div className="flex items-center gap-2">
							{/* Github mascot avatar */}
							<div className="w-5 h-5 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
								<svg
									className="w-3 h-3 text-zinc-650 dark:text-zinc-450 fill-current"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
							</div>
							<span className="text-xs font-semibold text-foreground">izaack55182</span>
						</div>
						<span className="text-[10px] text-muted-foreground pl-4 select-none">▼</span>
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2b8ef0] hover:text-[#2b8ef0]/80 mt-1.5 select-none transition-colors"
					>
						<span className="text-sm leading-none">+</span> Agregar cuenta
					</button>
				</div>

				{/* 3. Repository Grid */}
				<div className="space-y-1.5 mb-4">
					<span className="text-xs font-bold text-zinc-800 dark:text-neutral-200 block">
						Seleccionar un repositorio
					</span>
					{/* Search input mock */}
					<div className="w-full px-3 py-2 bg-card-interactive border border-border rounded-lg shadow-sm flex items-center gap-2">
						<span className="text-xs text-muted-foreground font-mono select-none">
							Buscar repositorios...
						</span>
					</div>
				</div>

				{/* Grid repository cards (2 columns with clean mock names) */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					{[
						{ name: 'ventura-app', isActive: true },
						{ name: 'ecommerce-platform' },
						{ name: 'react-dashboard' },
						{ name: 'serverless-api' },
						{ name: 'portfolio-website' },
						{ name: 'bun-microservices' },
					].map((repo) => (
						<div
							key={repo.name}
							className={cn(
								'px-4 py-3 border rounded-xl flex items-center justify-between select-none transition-colors cursor-pointer',
								repo.isActive
									? 'bg-[#2b8ef0]/5 border-[#2b8ef0]/40 text-[#2b8ef0]'
									: 'bg-card-interactive border-border text-zinc-800 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-zinc-700'
							)}
						>
							<span className="text-xs font-bold tracking-tight">{repo.name}</span>
							{repo.isActive && (
								<span className="h-1.5 w-1.5 rounded-full bg-[#2b8ef0] shadow-[0_0_8px_rgba(43,142,240,0.6)]" />
							)}
						</div>
					))}
				</div>

				{/* Note block */}
				<p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed mb-6 select-none">
					Si no se muestra su repositorio, configure el acceso al repositorio para la aplicación{' '}
					<button
						type="button"
						className="text-[#2b8ef0] hover:underline font-semibold transition-colors"
					>
						Cloudflare Pages
					</button>{' '}
					en GitHub.
				</p>

				{/* 4. Action Footer Divider & Buttons */}
				<div className="border-t border-border pt-4 flex items-center justify-between">
					<button
						type="button"
						className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-colors select-none"
					>
						Cancelar
					</button>
					<button
						type="button"
						className="bg-[#2b8ef0] hover:bg-[#2b8ef0]/90 text-white font-bold px-4 py-2 text-xs rounded-lg shadow-sm transition-colors cursor-pointer select-none"
					>
						Comenzar la instalación
					</button>
				</div>
			</div>
		</div>
	)
}
