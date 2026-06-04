import { ColorSchemeSwitch } from '@/components/color-scheme-switch'
import { Container } from '@/components/ui/container'
import Logo from './logo'

export function Header() {
	return (
		<header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
			<Container size="large" className="px-4">
				<div className="flex h-20 items-center justify-between">
					{/* Left: Logo */}
					<Logo variant="icon" className="size-8" />

					{/* Right: Color scheme switch */}
					<ColorSchemeSwitch />
				</div>
			</Container>
		</header>
	)
}
