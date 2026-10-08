import { NavLink, useLocation } from 'react-router'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icons/types'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { UserDropdown } from '@/components/user-dropdown'
import { ColorSchemeSwitch } from '@/routes/resource/color-scheme'
import { cn } from '@/utils/misc'
import Logo from './logo'

interface NavItem {
	label: string
	href: string
	icon: IconName
	items?: { label: string; href: string }[]
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
	{
		title: 'Application',
		items: [
			{ label: 'Dashboard', href: '/c/dashboard', icon: 'layout-dashboard' },
			{ label: 'Users', href: '/c/profile', icon: 'shield' },
		],
	},
]

export default function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation()

	return (
		<Sidebar className={cn('bg-sidebar p-2 sm:p-3', className)} variant="inset" {...props}>
			<SidebarContent className="px-1 pt-1">
				<div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:hidden">
					<Logo variant="brand" />
				</div>

				{NAV_SECTIONS.map((section) => (
					<SidebarGroup
						key={section.title}
						className="px-0 py-0 group-data-[collapsible=icon]:hidden"
					>
						<SidebarGroupLabel className="h-8 px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground/60">
							{section.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{section.items.map((item) => {
									const isActive =
										location.pathname.startsWith(item.href) &&
										(item.href !== '/' || location.pathname === '/')

									return (
										<SidebarMenuItem key={item.href}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.label}
												className={cn(
													'h-9 rounded-lg px-2.5 font-semibold transition-[background-color,color] duration-200 ease-out hover:bg-sidebar-accent/60 hover:text-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:shadow-none',
													isActive ? 'text-foreground' : 'text-muted-foreground'
												)}
											>
												<NavLink to={item.href}>
													<div
														className={cn(
															'flex size-5 items-center justify-center rounded-md transition-colors',
															isActive
																? 'text-foreground'
																: 'text-muted-foreground group-hover:text-foreground'
														)}
													>
														<Icon name={item.icon} className="size-4" />
													</div>
													<span className="text-sm leading-tight">{item.label}</span>
												</NavLink>
											</SidebarMenuButton>

											{item.items && (
												<SidebarMenuSub>
													{item.items.map((sub) => {
														const isSubActive = location.pathname.includes(sub.href)
														return (
															<SidebarMenuSubItem key={sub.href}>
																<SidebarMenuSubButton asChild isActive={isSubActive}>
																	<NavLink to={sub.href}>
																		<span>{sub.label}</span>
																	</NavLink>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														)
													})}
												</SidebarMenuSub>
											)}
										</SidebarMenuItem>
									)
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="p-1">
				<SidebarMenu>
					<SidebarMenuItem className="flex w-full items-center justify-between border-t border-sidebar-border/60 px-2 pt-3">
						<UserDropdown />
						<div className="flex shrink-0 items-center justify-center pl-2">
							<ColorSchemeSwitch />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
