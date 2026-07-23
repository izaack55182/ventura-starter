// CORE
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMediaQuery } from '@/utils/hooks/use-media-query'
// UTILS
import { cn } from '@/utils/misc'

// COMPONENTS
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './ui/drawer'

interface DialogDrawerWrapperProps {
	title?: string
	description?: string
	onDismiss?: () => void
	redirectTo?: string
	children: React.ReactNode
	className?: string
	noPadding?: boolean
	fullHeight?: boolean
}

export function DialogDrawerWrapper({
	title,
	description,
	onDismiss,
	redirectTo,
	children,
	className,
	noPadding = false,
	fullHeight = false,
}: DialogDrawerWrapperProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen)
		if (!isOpen) {
			setTimeout(() => {
				if (onDismiss) {
					onDismiss()
				} else if (redirectTo) {
					navigate(redirectTo)
				}
			}, 250)
		}
	}

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					className={cn(
						'max-w-2xl flex flex-col p-0 overflow-hidden shadow-none',
						fullHeight ? 'h-[92vh]' : 'h-fit max-h-[92vh]',
						className
					)}
				>
					<DialogHeader className="px-6 py-3 border-b border-border  shrink-0">
						<DialogTitle className="text-xl font-bold flex items-center gap-2">{title}</DialogTitle>
						<DialogDescription className="text-[14px]">{description}</DialogDescription>
					</DialogHeader>
					<div
						className={cn(
							'flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar',
							!noPadding && 'p-6'
						)}
					>
						{children}
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerContent className={cn('h-fit max-h-[90vh]', className)}>
				<DrawerHeader className="px-6 py-5 border-b border-border">
					<DrawerTitle className="text-lg font-bold">{title}</DrawerTitle>
					<DrawerDescription className="text-xs">{description}</DrawerDescription>
				</DrawerHeader>
				<div className={cn('overflow-y-auto custom-scrollbar', noPadding ? '' : 'p-4')}>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	)
}
