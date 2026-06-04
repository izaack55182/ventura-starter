import type { ReactNode } from 'react'
import { cn } from '@/utils/misc'

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
	return (
		<div
			className={cn(
				'grid w-full auto-rows-[25rem] md:auto-rows-[23rem] grid-cols-3 gap-6',
				className
			)}
		>
			{children}
		</div>
	)
}

const BentoCard = ({
	name,
	className,
	background,
	Icon,
	description,
	href,
	cta,
	badge,
	badgeColor,
}: {
	name: string
	className: string
	background?: ReactNode
	Icon?: ReactNode
	description: ReactNode
	href?: string
	cta?: string
	badge?: string
	badgeColor?: string
}) => {
	return (
		<div
			key={name}
			className={cn(
				'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl border border-border p-6',
				// Light mode styles
				'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.04)]',
				// Dark mode styles
				'dark:bg-zinc-900/10 dark:border-white/5 dark:[box-shadow:0_-20px_80px_-20px_#ffffff03_inset]',
				className
			)}
		>
			{/* Top Area: Icon, Title, Description, Link */}
			<div className="flex flex-col items-start gap-3 w-full">
				<div className="flex items-center justify-between w-full">
					{Icon && (
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-neutral-700 dark:text-neutral-300">
							{Icon}
						</div>
					)}
					{badge && (
						<span
							className={cn(
								'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium',
								badgeColor
							)}
						>
							{badge}
						</span>
					)}
				</div>

				<div className="space-y-1 w-full">
					<h3 className="text-xl md:text-2xl font-bold text-foreground">{name}</h3>
					<div className="text-muted-foreground text-body-2xs md:text-body-xs leading-relaxed">
						{description}
					</div>
				</div>

				{cta && href && (
					<a
						href={href}
						className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2b8ef0] hover:text-[#2b8ef0]/80 transition-colors uppercase tracking-wider"
					>
						{cta}
						<span className="text-xs font-mono leading-none">›</span>
					</a>
				)}
			</div>

			{/* Bottom Area: Visual Graphic / Code */}
			<div className="relative w-full flex-1 min-h-[120px] mt-4 flex items-center justify-center overflow-hidden">
				{background}
			</div>
		</div>
	)
}

export { BentoCard, BentoGrid }
