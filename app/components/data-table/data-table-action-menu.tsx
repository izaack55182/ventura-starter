// CORE
import * as React from 'react'
import { Link } from 'react-router'
import { Icon } from '@/components/ui/icon'
// CONSTANTS
import { ACTION_TYPE, type ActionItem } from '@/constants/data-table-types'
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
// UTILS
import { cn } from '@/utils/misc'
import DeleteConfirmation from '../delete-confirmation'
import { Button, buttonVariants } from '../ui/button'
// COMPONENTS
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export function DataTableActionMenu({
	id,
	actions,
	type,
	className,
}: {
	id: number | string
	actions: ActionItem[]
	type: { value: string; basePath: string; title?: string; editPermission?: string }
	className?: string
}) {
	const params = useUpdateSearchParams()
	const redirectTo = `redirectTo=${encodeURIComponent(params.getCurrentPathWithParams())}`

	if (actions.length === 0) return null

	// Extract the primary action (first item) to render directly as a button
	const [primaryAction, ...remainingActions] = actions

	return (
		<div className={cn('flex items-center justify-end gap-2', className)}>
			{/* Primary Action Button */}
			{primaryAction &&
				(primaryAction.type === ACTION_TYPE.DELETE ? (
					<DeleteConfirmation id={id} type={type.value} title={type.title} />
				) : (
					<Link
						to={{
							pathname:
								primaryAction.type === ACTION_TYPE.CUSTOM
									? `${primaryAction.to}`
									: `${type.basePath ?? ''}${id}${primaryAction.to ? primaryAction.to : ''}`,
							search:
								primaryAction.type === ACTION_TYPE.CUSTOM
									? primaryAction.search
									: redirectTo && !primaryAction.target
										? redirectTo
										: undefined,
						}}
						target={primaryAction.target}
						preventScrollReset={!!redirectTo}
						prefetch={primaryAction.prefetch ? 'intent' : undefined}
						download={primaryAction.download}
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'border-red-500/20 hover:border-red-500/40 text-red-600 hover:bg-red-500/5 font-semibold text-xs py-1.5 h-auto cursor-pointer'
						)}
					>
						{primaryAction.label}
					</Link>
				))}

			{/* Dropdown Menu for remaining actions */}
			{remainingActions.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
						>
							<Icon name="ellipsis" className="size-4" />
							<span className="sr-only">Abrir menú</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent
							align="end"
							className="w-44 rounded-2xl border border-border bg-popover shadow-xl p-1.5"
							sideOffset={8}
						>
							{remainingActions.map((action, index) => {
								const isDelete = action.type === ACTION_TYPE.DELETE
								const isAccept = action.type === ACTION_TYPE.ACCEPT
								return (
									<React.Fragment key={index}>
										{(isDelete || isAccept) && remainingActions.length > 1 && (
											<DropdownMenuSeparator className="my-1 bg-border/50" />
										)}
										<DropdownMenuItem asChild>
											{isDelete ? (
												<DeleteConfirmation id={id} type={type.value} title={type.title} />
											) : (
												<Link
													to={{
														pathname:
															action.type === ACTION_TYPE.CUSTOM
																? `${action.to}`
																: `${type.basePath ?? ''}${id}${action.to ? action.to : ''}`,
														search:
															action.type === ACTION_TYPE.CUSTOM
																? action.search
																: redirectTo && !action.target
																	? redirectTo
																	: undefined,
													}}
													target={action.target}
													preventScrollReset={!!redirectTo}
													prefetch={action.prefetch ? 'intent' : undefined}
													download={action.download}
													className={cn(
														'flex items-center gap-2.5 w-full px-2.5 py-2 text-sm rounded-xl cursor-pointer font-medium outline-none',
														'text-foreground/80 hover:bg-accent hover:text-foreground transition-colors'
													)}
												>
													<Icon name={action.icon} className="size-4 text-muted-foreground/70" />
													{action.label}
												</Link>
											)}
										</DropdownMenuItem>
									</React.Fragment>
								)
							})}
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			)}
		</div>
	)
}
