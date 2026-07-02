import { ColorSchemeSwitch } from '@/components/color-scheme-switch'
import { Container } from '@/components/ui/container'
import Logo from './logo'
import { MobileNavigation } from './public-mobile-navigation'

export function Header() {
	return (
		<header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
			<Container size="large" className="px-4">
				<div className="flex h-16 md:h-20 items-center justify-between">
					{/* Left: Logo */}
					<Logo variant="icon" className="size-7 md:size-8" />

					{/* Right: Controls */}
					<div className="flex items-center gap-2">
						{/* Color scheme — always visible */}
						<ColorSchemeSwitch />
						{/* Mobile hamburger menu — only on small screens */}
						<MobileNavigation />
					</div>
				</div>
			</Container>
		</header>
	)
}
