import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { data, Link, Outlet, useFetcher, useLoaderData, useMatches } from 'react-router'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Page, PageContent, PageHeader, PageTitle } from '@/components/ui/page'
import { StatusButton } from '@/components/ui/status-button'
import * as schema from '@/drizzle/schema.server'
import { requireUserId } from '@/features/security/authentication/server/auth.server'
import { useUser } from '@/features/user/utils'
import { db } from '@/utils/db.server'
import { cn } from '@/utils/misc'
import { dataWithSuccess } from '@/utils/toast.server'
import EditUserForm from '../components/edit-user-form'
import { INTENT } from '../constants'
import { EditUserSchema } from '../schemas'
import { twoFAVerificationType } from '../types'
import type { Route } from './+types/profile'

export const BreadcrumbHandle = z.object({ breadcrumb: z.any() })
export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>

const BreadcrumbHandleMatch = z.object({ handle: BreadcrumbHandle })

export const handle: BreadcrumbHandle = {
	breadcrumb: <Icon name="user">Perfil</Icon>,
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const verification = await db.query.verification.findFirst({
		where: and(
			eq(schema.verification.type, twoFAVerificationType),
			eq(schema.verification.target, String(userId))
		),
		columns: { id: true },
	})
	return { is2FAEnabled: Boolean(verification) }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	console.log('ACTION HIT!', { userId, intent, data: Object.fromEntries(formData.entries()) })

	switch (intent) {
		case INTENT.EDIT_USER: {
			const submission = parseWithZod(formData, { schema: EditUserSchema })
			if (submission.status !== 'success') {
				return data({ result: submission.reply() }, { status: 400 })
			}

			const { firstName, lastName, username } = submission.value

			await db
				.update(schema.user)
				.set({
					firstName,
					lastName,
					username,
				})
				.where(eq(schema.user.id, userId))

			return dataWithSuccess(
				{ result: submission.reply({ resetForm: false }) },
				'Perfil Actualizado'
			)
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export default function ProfilePage() {
	const user = useUser()
	const data = useLoaderData<typeof loader>()
	const enable2FAFetcher = useFetcher()
	const matches = useMatches()

	const breadcrumbs = matches
		.map((m) => {
			const result = BreadcrumbHandleMatch.safeParse(m)
			if (!result.success || !result.data.handle.breadcrumb) return null
			return (
				<Link key={m.id} to={m.pathname} className="flex items-center">
					{result.data.handle.breadcrumb}
				</Link>
			)
		})
		.filter(Boolean)

	return (
		<Page variant="settings">
			<PageHeader>
				<nav aria-label="breadcrumb">
					<ol className="flex items-center gap-1 text-sm">
						<li className="flex items-center gap-1 text-muted-foreground">
							<Link
								to="/"
								className="flex items-center gap-1 hover:text-foreground transition-colors"
							>
								<Icon name="layout-dashboard" size="sm">
									Inicio
								</Icon>
							</Link>
							<Icon name="arrow-right" size="sm" className="text-muted-foreground/50 mx-1" />
						</li>
						{breadcrumbs.map((breadcrumb, i, arr) => (
							<li
								key={i}
								className={cn('flex items-center gap-1', {
									'text-muted-foreground': i < arr.length - 1,
									'text-foreground font-medium': i === arr.length - 1,
								})}
							>
								{i > 0 && (
									<Icon name="arrow-right" size="sm" className="text-muted-foreground/50 mx-1" />
								)}
								{breadcrumb}
							</li>
						))}
					</ol>
				</nav>
				<PageTitle>Perfil</PageTitle>
			</PageHeader>
			<PageContent>
				<div className="space-y-6">
					{/* Ya no necesitas pasar lastResult, el fetcher interno se encarga */}
					<EditUserForm user={user} />

					<div className="flex flex-col gap-6 mt-8 pt-8 border-t border-border/50">
						<div>
							<h2 className="text-xl font-semibold mb-1">Seguridad</h2>
							<p className="text-sm text-muted-foreground">
								Administra la seguridad de tu cuenta y métodos de autenticación.
							</p>
						</div>

						{/* 2FA Card */}
						<div className="flex items-center justify-between gap-4 p-5 border rounded-xl bg-card/50">
							<div className="flex items-center gap-3">
								<Icon name="lock" className="size-5 text-muted-foreground shrink-0" />
								<div>
									<h3 className="text-sm font-semibold">Autenticación de Dos Factores (2FA)</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										{data.is2FAEnabled ? 'Habilitado' : 'No habilitado'}
									</p>
								</div>
							</div>

							{data.is2FAEnabled ? (
								<Button asChild variant="outline" size="sm">
									<Link to="/profile/two-factor/disable">Reemplazar</Link>
								</Button>
							) : (
								<Button asChild size="sm">
									<Link to="/profile/two-factor/verify">Habilitar</Link>
								</Button>
							)}
						</div>

						{/* Passkeys Card */}
						<div className="flex items-center justify-between gap-4 p-5 border rounded-xl bg-card/50">
							<div className="flex items-center gap-3">
								<Icon name="passkey" className="size-5 text-muted-foreground shrink-0" />
								<div>
									<h3 className="text-sm font-semibold">Passkeys</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										Llaves de seguridad y autenticación biométrica
									</p>
								</div>
							</div>

							<Button asChild variant="outline" size="sm">
								<Link to="/profile/passkeys">Administrar</Link>
							</Button>
						</div>
					</div>

					{/* <ChangePasswordForm /> */}
				</div>
			</PageContent>
			<Outlet />
		</Page>
	)
}
