import type { MetaFunction } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { cn, getMeta } from '@/utils/misc'

export async function loader() {
	return {}
}

export default function Users() {
	return (
		<div className="space-y-8 p-6 lg:p-8">
			{/* ... Rest of your component */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
						Usuarios
					</h1>
					<p className="text-lg text-muted-foreground max-w-[600px]">
						Administra los usuarios del sistema, sus roles y estados de cuenta.
					</p>
				</div>
				<Button size="lg" variant="outline">
					<Icon name="users" className="size-4 mr-2" />
					Nuevo Usuario
				</Button>
			</div>

			<Card className="border-primary/5 shadow-xl shadow-foreground/5 overflow-hidden">
				<CardHeader className="bg-muted/30 border-b border-border/50">
					<CardTitle className="text-lg">Listado de Usuarios</CardTitle>
					<CardDescription>Mostrando los usuarios registrados en la plataforma.</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<div className="relative w-full overflow-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border/50 bg-muted/10 transition-colors">
									<th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
										Usuario
									</th>
									<th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
										Email
									</th>
									<th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
										Rol
									</th>
									<th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
										Estado
									</th>
									<th className="h-12 px-6 text-right align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'Izaack', email: 'izaack@ventura.com', role: 'Admin', status: 'Active' },
									{
										name: 'John Doe',
										email: 'john@example.com',
										role: 'Manager',
										status: 'Active',
									},
									{
										name: 'Sarah Smith',
										email: 'sarah@example.com',
										role: 'Member',
										status: 'Inactive',
									},
								].map((user, i) => (
									<tr
										key={i}
										className="border-b border-border/40 transition-all hover:bg-muted/30 group"
									>
										<td className="px-6 py-4 align-middle">
											<div className="flex items-center gap-3">
												<div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
													{user.name.charAt(0)}
												</div>
												<span className="font-semibold">{user.name}</span>
											</div>
										</td>
										<td className="px-6 py-4 align-middle text-muted-foreground">{user.email}</td>
										<td className="px-6 py-4 align-middle">
											<Badge
												variant="outline"
												className="font-medium px-2 py-0 border-primary/20 text-primary bg-primary/5"
											>
												{user.role}
											</Badge>
										</td>
										<td className="px-6 py-4 align-middle">
											<div className="flex items-center gap-2">
												<div
													className={cn(
														'size-2 rounded-full',
														user.status === 'Active'
															? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
															: 'bg-muted-foreground/30'
													)}
												/>
												<span className="text-xs font-medium">{user.status}</span>
											</div>
										</td>
										<td className="px-6 py-4 align-middle text-right">
											<div className="flex items-center justify-end gap-2">
												<Button variant="ghost" size="icon">
													<Icon name="layout-dashboard" className="size-4" />
												</Button>
												<Button variant="ghost" size="icon">
													<Icon name="x" className="size-4" />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ matches, location }: any) => {
	return getMeta({
		title: 'Usuarios',
		description: 'Administración de usuarios en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}
