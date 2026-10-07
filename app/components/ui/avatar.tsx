'use client'

import { Avatar as AvatarPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/utils/misc'

const AVATAR_PALETTE = [
	'bg-violet-500/10 text-violet-600 dark:text-violet-400',
	'bg-blue-500/10 text-blue-600 dark:text-blue-400',
	'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
	'bg-amber-500/10 text-amber-600 dark:text-amber-400',
	'bg-rose-500/10 text-rose-600 dark:text-rose-400',
	'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
	'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
]

function getAvatarColor(seed?: string | number) {
	if (seed === undefined) return 'bg-muted text-muted-foreground'

	let hash = 0
	if (typeof seed === 'string') {
		for (let i = 0; i < seed.length; i++) {
			hash = seed.charCodeAt(i) + ((hash << 5) - hash)
		}
	} else {
		hash = seed
	}

	return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

function Avatar({
	className,
	size = 'default',
	shape = 'square',
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
	size?: 'default' | 'sm' | 'lg'
	shape?: 'circle' | 'square'
}) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			data-shape={shape}
			className={cn(
				'group/avatar relative flex shrink-0 overflow-hidden select-none border border-border shadow-sm',
				'data-[size=default]:size-8 data-[size=sm]:size-8 data-[size=lg]:size-12',
				'data-[shape=circle]:rounded-full data-[shape=square]:rounded-full',
				className
			)}
			{...props}
		/>
	)
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn('aspect-square size-full object-cover', className)}
			{...props}
		/>
	)
}

function AvatarFallback({
	className,
	seed,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
	seed?: string | number
}) {
	const colorClass = getAvatarColor(seed)

	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				'flex size-full items-center justify-center font-bold text-[13px] group-data-[size=sm]/avatar:text-xs group-data-[size=lg]/avatar:text-base',
				colorClass,
				className
			)}
			{...props}
		/>
	)
}

import { cva, type VariantProps } from 'class-variance-authority'

const avatarBadgeVariants = cva(
	'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 ring-background select-none',
	{
		variants: {
			size: {
				sm: 'size-2 [&>svg]:hidden',
				default: 'size-2.5 [&>svg]:size-2',
				lg: 'size-3 [&>svg]:size-2',
			},
			status: {
				default: 'bg-primary text-primary-foreground',
				active: 'bg-emerald-500',
				inactive: 'bg-zinc-400',
			},
		},
		defaultVariants: {
			size: 'default',
			status: 'default',
		},
	}
)

function AvatarBadge({
	className,
	size,
	status,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof avatarBadgeVariants>) {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(avatarBadgeVariants({ size, status }), className)}
			{...props}
		/>
	)
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="avatar-group"
			className={cn(
				'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
				className
			)}
			{...props}
		/>
	)
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="avatar-group-count"
			className={cn(
				'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
				className
			)}
			{...props}
		/>
	)
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage }
