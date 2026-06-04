import { NavLink, useLocation } from 'react-router'
import { ColorSchemeSwitch } from '@/components/color-scheme-switch'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icons/types'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar'
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
			{ label: 'Customers', href: '/c/customers', icon: 'users' },
			{ label: 'Users', href: '/c/users', icon: 'shield' },
			{ label: 'Accounting', href: '/c/accounting', icon: 'calculator' },
			{ label: 'Analytics', href: '/c/analytics', icon: 'chart-spline' },
		],
	},
	{
		title: 'System',
		items: [{ label: 'Settings', href: '/c/settings', icon: 'settings' }],
	},
]

export default function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation()

	return (
		<Sidebar className={className} variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-transparent cursor-pointer h-12 px-0 rounded-md"
						>
							<div className="size-7 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
								<Icon name="layers" className="size-4 text-white" />
							</div>
							<div className="flex flex-col gap-0 leading-none overflow-hidden ml-2">
								<span className="font-semibold text-[14.5px] text-foreground truncate">
									Acme Inc
								</span>
								<span className="text-xs text-muted-foreground truncate">Enterprise</span>
							</div>
							<Icon
								name="chevron-down"
								className="ml-auto size-4 text-muted-foreground/70 shrink-0"
							/>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

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
													'h-[30px] px-0 hover:bg-transparent hover:text-foreground hover:opacity-100 data-[active=true]:bg-transparent transition-all',
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
					<SidebarMenuItem className="flex items-center gap-2 pt-2 border-t border-sidebar-border/30">
						<SidebarMenuButton
							size="lg"
							className="flex-1 px-0 hover:bg-transparent data-[state=open]:bg-transparent transition-colors cursor-pointer"
						>
							<div className="size-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
								<img src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="User" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left ml-2">
								<span className="font-semibold text-[14.5px] truncate text-foreground">shadcn</span>
								<span className="text-xs text-muted-foreground truncate">m@example.com</span>
							</div>
							<Icon
								name="chevrons-up-down"
								className="ml-auto size-4 text-muted-foreground shrink-0"
							/>
						</SidebarMenuButton>

						<div className="shrink-0 flex items-center justify-center pl-2">
							<ColorSchemeSwitch />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
