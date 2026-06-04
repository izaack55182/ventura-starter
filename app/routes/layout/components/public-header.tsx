import { Link } from 'react-router'
import { ColorSchemeSwitch } from '@/components/color-scheme-switch'
import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Logo from './logo'
import { MobileNavigation } from './public-mobile-navigation'

type NavLink = {
	label: string
	href: string
	external?: boolean
}

const NAV_LINKS: NavLink[] = [
	{ label: 'Inicio', href: '/' },
	{ label: 'Runtime', href: '#runtime' },
	{ label: 'Casos de Uso', href: '#use-cases' },
	{ label: 'Baterías', href: '#batteries' },
	{ label: 'Despliegues', href: '#deploy' },
]

const navLinkClass =
	'inline-flex items-center gap-1 px-2 py-1.5 text-body-2xs font-normal text-zinc-500 transition-colors hover:bg-transparent focus:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-200'

export function Header() {
	return (
		<header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
			<Container size="large" className="px-4">
				<div className="flex h-20 items-center justify-between">
					{/* Left: Logo + Navigation */}
					<div className="flex items-center gap-6">
						<Logo variant="icon" className="size-8" />

						{/* Navigation (Desktop only) */}
						<div className="hidden md:flex items-center">
							<NavigationMenu viewport={false}>
								<NavigationMenuList className="gap-1">
									{NAV_LINKS.map((link) => (
										<NavigationMenuItem key={link.href}>
											<NavigationMenuLink asChild className={navLinkClass}>
												{link.href.startsWith('/') ? (
													<Link to={link.href}>{link.label}</Link>
												) : (
													<a
														href={link.href}
														{...(link.external && {
															target: '_blank',
															rel: 'noreferrer',
														})}
													>
														{link.label}
														{link.external && <Icon name="arrow-up-right" />}
													</a>
												)}
											</NavigationMenuLink>
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</div>
					</div>

					{/* Right actions (Theme toggle on desktop, Mobile menu on mobile) */}
					<div className="flex items-center gap-4">
						<div className="hidden md:block">
							<ColorSchemeSwitch />
						</div>
						<div className="md:hidden">
							<MobileNavigation />
						</div>
					</div>
				</div>
			</Container>
		</header>
	)
}
