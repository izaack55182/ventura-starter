import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { UserDropdown } from '@/components/user-dropdown'
import { useOptionalUser } from '@/features/user/utils'
import { ColorSchemeSwitch } from '@/routes/resource/color-scheme'
import Logo from './logo'
import { MobileNavigation } from './public-mobile-navigation'

export function Header() {
	const user = useOptionalUser()
	return (
		<header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
			<Container size="large" className="px-4">
				<div className="flex h-20 items-center justify-between">
					{/* Left: Logo + Navigation */}
					<div className="flex items-center gap-6">
						<Logo variant="icon" className="size-8" />
					</div>
					<div className="flex items-center gap-4">
						<div className="hidden md:block">
							<ColorSchemeSwitch />
						</div>
						{user ? (
							<UserDropdown />
						) : (
							<div className="hidden md:block">
								<Button asChild variant="default" size="sm">
									<Link to="/login">Iniciar Sesión</Link>
								</Button>
							</div>
						)}
						<div className="md:hidden">
							<MobileNavigation />
						</div>
					</div>
				</div>
			</Container>
		</header>
	)
}
