import { useState } from 'react'
import { NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { UserDropdown } from '@/components/user-dropdown'
import { useOptionalUser } from '@/features/user/utils'
import { cn } from '@/utils/misc'
import Logo from './logo'

const PUBLIC_NAVIGATION = [{ label: 'PROXIAMENTE', to: '/' }] as const

export function MobileNavigation() {
	const [open, setOpen] = useState(false)
	const user = useOptionalUser()

	return (
		<div>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="rounded-full">
						<Icon name="menu" className="size-5 text-foreground" />
						<span className="sr-only">Abrir menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-[min(92vw,380px)] gap-0 border-l border-border bg-background p-0 shadow-2xl"
				>
					<SheetHeader className="border-b border-border px-6 py-6 text-left">
						<Logo variant="long" className="w-32" />
						<p className="mt-4 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
							EXPLORA VENTURA STACK
						</p>
					</SheetHeader>

					<nav
						className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5"
						aria-label="Navegacion principal"
					>
						{PUBLIC_NAVIGATION.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								onClick={() => setOpen(false)}
								className={({ isActive }) =>
									cn(
										'group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-foreground hover:bg-muted'
									)
								}
							>
								<span>{item.label}</span>
								<Icon
									name="chevron-right"
									className="size-4 opacity-55 transition-transform group-hover:translate-x-0.5"
								/>
							</NavLink>
						))}
					</nav>

					{user ? (
						<div className="border-t border-border bg-muted/30 p-5">
							<div className="flex items-center gap-3">
								<UserDropdown />
								<span className="text-sm font-semibold text-foreground">Mi cuenta</span>
							</div>
						</div>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	)
}
