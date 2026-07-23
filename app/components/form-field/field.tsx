import type { FieldMetadata } from '@conform-to/react'
import { motion } from 'framer-motion'
import { type ReactNode, useId } from 'react'
import { cn } from '@/utils/misc'
import { Icon } from '../ui/icon'
import { Label } from '../ui/label'

export function Field({
	labelProps,
	meta,
	children,
	className,
	variant,
	orientation = 'vertical',
}: {
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	meta: FieldMetadata<any>
	children: ReactNode
	className?: string
	variant?: string | null | undefined
	orientation?: 'vertical' | 'horizontal'
}) {
	const fallbackId = useId()
	const id = meta.id ?? fallbackId

	return (
		<div
			className={cn(
				'flex gap-2 w-full',
				orientation === 'vertical'
					? 'flex-col'
					: 'flex-col sm:flex-row sm:items-center justify-between sm:gap-8 border-t border-border/18 py-5 first:border-t-0',
				className
			)}
		>
			{labelProps && (
				<Label
					htmlFor={id}
					{...labelProps}
					className={cn(
						'text-muted-foreground text-[14px] font-regular block',
						(variant === 'settings' || orientation === 'horizontal') &&
							'text-[14px] font-semibold text-foreground',
						orientation === 'horizontal' && 'sm:w-64 shrink-0',
						labelProps.className
					)}
				/>
			)}
			<div className={cn('w-full', orientation === 'horizontal' && 'sm:flex-1 sm:max-w-xs')}>
				{children}
			</div>
		</div>
	)
}

export function FieldError({ errors, id }: { errors?: string[] | null; id?: string }) {
	if (!errors?.length) return null

	return (
		<motion.div
			id={id}
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			className="flex flex-col gap-1.5 mt-1"
		>
			{errors.map((error, i) => (
				<div key={i} className="flex items-center gap-1.5 text-destructive">
					<Icon name="circle-alert" className="size-3.5 opacity-90 shrink-0" />
					<span className="text-[12px] font-medium tracking-tight leading-none">{error}</span>
				</div>
			))}
		</motion.div>
	)
}
