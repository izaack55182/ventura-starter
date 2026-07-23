import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useFetcher } from 'react-router'
import type { z } from 'zod'
// COMPONENTS
import { TextField } from '@/components/form-field/text'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Section } from '@/components/ui/form'
import { StatusButton } from '@/components/ui/status-button'
// CONSTANTS
import { INTENT } from '../constants'
import type { action } from '../routes/profile'

// TYPES & SCHEMAS
import { EditUserSchema } from '../schemas'

export default function EditUserForm({ user, lastResult }: { user: any; lastResult?: any }) {
	const fetcher = useFetcher<typeof action>()

	const [form, fields] = useForm<z.infer<typeof EditUserSchema>>({
		id: `edit-profile:${user.id}`,
		lastResult: fetcher.data?.result || lastResult,
		constraint: getZodConstraint(EditUserSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, {
				schema: EditUserSchema,
			})
			console.log('FORM DATA:', Object.fromEntries(formData.entries()))
			if (parsed.status === 'error') {
				console.error('ZOD ERRORS:', parsed.error)
			} else {
				console.log('ZOD VALIDATION SUCCESS:', parsed)
			}
			return parsed
		},
		shouldRevalidate: 'onBlur',
		defaultValue: {
			...user,
			intent: INTENT.EDIT_USER,
		},
	})

	return (
		<fetcher.Form
			method="POST"
			{...getFormProps(form)}
			onSubmit={(e) => {
				console.log('=== FORM ONSUBMIT FIRED ===')
				if (form.onSubmit) form.onSubmit(e as any)
			}}
		>
			<Section
				variant="settings"
				title="Información Personal"
				description="Actualiza tu nombre y nombre de usuario."
			>
				<Card variant="settings" className="mt-4">
					<CardContent className="space-y-6 pt-8">
						<div className="flex flex-col gap-6">
							<TextField
								meta={fields.firstName}
								orientation="horizontal"
								labelProps={{ children: 'Nombre' }}
								inputProps={{ placeholder: 'Nombre' }}
							/>
							<TextField
								meta={fields.lastName}
								orientation="horizontal"
								labelProps={{ children: 'Apellido' }}
								inputProps={{ placeholder: 'Apellido' }}
							/>
							<TextField
								meta={fields.username}
								orientation="horizontal"
								labelProps={{ children: 'Username' }}
								inputProps={{ placeholder: 'username', type: 'text' }}
							/>
						</div>
					</CardContent>

					<CardFooter className="justify-between">
						<div className="text-sm text-destructive">{form.errors}</div>
						<StatusButton
							type="submit"
							status={
								fetcher.state !== 'idle'
									? 'pending'
									: fetcher.data?.result?.status === 'success'
										? 'success'
										: fetcher.data?.result?.status === 'error'
											? 'error'
											: 'idle'
							}
						>
							Guardar Cambios
						</StatusButton>
					</CardFooter>
				</Card>
			</Section>
			<input type="hidden" name="id" value={user.id} />
			<input type="hidden" name="intent" value={INTENT.EDIT_USER} />
		</fetcher.Form>
	)
}
