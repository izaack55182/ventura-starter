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
		<Sidebar className={className} variant="inset" {...props}>
			<SidebarContent>
				{NAV_SECTIONS.map((section) => (
					<SidebarGroup key={section.title} className="group-data-[collapsible=icon]:hidden">
						<SidebarGroupLabel className="text-sm font-medium text-muted-foreground/50 px-0 h-8 mt-2 mb-1">
							{section.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-2.5">
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
													'h-[30px] px-0 hover:bg-transparent hover:text-foreground hover:opacity-100 data-[active=true]:bg-transparent',
													isActive
														? 'font-medium text-foreground opacity-100'
														: 'text-muted-foreground font-normal opacity-80'
												)}
											>
												<NavLink to={item.href}>
													<div
														className={cn(
															'flex items-center justify-center size-6 rounded-md mr-1.5 transition-colors',
															isActive
																? 'text-primary'
																: 'text-muted-foreground/70 group-hover:text-foreground'
														)}
													>
														<Icon name={item.icon} className="size-4" />
													</div>
													<span className="text-[14.5px] leading-tight">{item.label}</span>
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

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center justify-between w-full pt-2 border-t border-sidebar-border/30 px-2">
						<UserDropdown />

						<div className="shrink-0 flex items-center justify-center pl-2">
							<ColorSchemeSwitch />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
