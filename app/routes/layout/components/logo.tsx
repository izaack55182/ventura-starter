// CORE

// UTILS
import { cva } from 'class-variance-authority'
import { Link } from 'react-router'
// COMPONENTS
import { type ColorScheme, useTheme } from '@/routes/resource/color-scheme'
import { cn } from '@/utils/misc'

type LogoProps = {
	redirect?: string
	className?: string
	variant: 'long' | 'icon' | 'symbol' | 'brand'
	theme?: ColorScheme
	alt?: string
}

export const logoVariants = cva('', {
	variants: {
		variant: {
			long: 'w-40 h-auto',
			icon: 'size-7',
			symbol: 'size-7',
			brand: 'w-80 h-auto',
		},
	},
})

export default function Logo({ redirect, className, variant, alt, theme }: LogoProps) {
	const preferredColorScheme = useTheme()
	const finalTheme = theme ?? preferredColorScheme

	const isIcon = variant === 'icon'
	const themeSuffix = finalTheme === 'dark' ? 'dark' : 'light'

	// 'icon' uses the standalone symbol asset (ventura-{theme}.svg),
	// 'long' uses the full wordmark (ventura-long-{theme}.svg)
	const src = isIcon
		? `/images/logo/ventura-${themeSuffix}.svg`
		: `/images/logo/ventura-long-${themeSuffix}.svg`

	return (
		<Link to={redirect ? redirect : '/'}>
			<img
				decoding="sync"
				className={cn(logoVariants({ variant }), 'transition-none', className)}
				alt={alt ? alt : 'Ventura Logo'}
				src={src}
				width={isIcon ? 28 : 160}
				height={isIcon ? 28 : 40}
			/>
		</Link>
	)
}
