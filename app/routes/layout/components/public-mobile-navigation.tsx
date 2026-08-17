import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { UserDropdown } from '@/components/user-dropdown'
import { useOptionalUser } from '@/features/user/utils'
import { ColorSchemeSwitch } from '@/routes/resource/color-scheme'
import Logo from './logo'

export function MobileNavigation() {
	const [open, setOpen] = useState(false)
	const user = useOptionalUser()
	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon">
						<Icon name="menu" className="size-6 text-foreground" />
						<span className="sr-only">Abrir menú</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-[300px] sm:w-[380px] bg-background/60 backdrop-blur-3xl border-l border-border/40 p-0 flex flex-col"
				>
					<div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] pointer-events-none -mr-32 -mt-32 rounded-full" />
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none -ml-32 -mb-32 rounded-full" />

					<SheetHeader className="p-8 text-left border-b border-border/10 relative z-10">
						<div className="flex items-center justify-between">
							<Logo variant="long" className="w-32" />
						</div>
					</SheetHeader>
					<div className="p-8 mt-auto border-t border-border/10 bg-muted/20 relative z-10 flex flex-col gap-5">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-0.5">
								<span className="font-bold text-sm text-foreground/80">Apariencia</span>
							</div>
							<ColorSchemeSwitch />
						</div>

						<div className="pt-4 border-t border-border/10 flex flex-col gap-3">
							{user ? (
								<div className="flex items-center gap-3">
									<UserDropdown />
									<span className="font-semibold text-sm text-muted-foreground">Mi Cuenta</span>
								</div>
							) : (
								<Button
									asChild
									variant="default"
									className="w-full justify-center"
									onClick={() => setOpen(false)}
								>
									<Link to="/login">Iniciar Sesión</Link>
								</Button>
							)}
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
