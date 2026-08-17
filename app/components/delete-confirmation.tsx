// CORE

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { z } from 'zod'
// COMPONENTS
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { FormFooter, FormRow } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { StatusButton } from '@/components/ui/status-button'
// UTILS
import { useDoubleCheck } from '@/utils/misc'

const DeleteConfirmationSchema = z.object({
	id: z.union([z.string(), z.number()]),
	intent: z.string(),
})

const DeleteConfirmation = ({
	id,
	type,
	title,
	description,
	variant = 'dropdown',
	className,
}: {
	id: number | string
	type: string
	title?: string
	description?: string
	variant?: 'dropdown' | 'icon'
	className?: string
}) => {
	const deleteFetcher = useFetcher()
	const isPending = deleteFetcher.state !== 'idle'
	const [open, setOpen] = useState(false)
	const dc = useDoubleCheck()

	const [form, fields] = useForm({
		constraint: getZodConstraint(DeleteConfirmationSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: DeleteConfirmationSchema })
		},
		defaultValue: {
			id,
			intent: `delete-${type}`,
		},
		shouldRevalidate: 'onBlur',
	})

	useEffect(() => {
		if (deleteFetcher.data?.status === 'success') {
			setOpen(false)
		}
	}, [deleteFetcher.data])

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					size={variant === 'dropdown' ? 'dropdown' : 'sm'}
					className={className}
				>
					<Icon name="trash" />
					{variant === 'dropdown' && 'Eliminar'}
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader className="flex flex-row items-center gap-4">
					<div className="flex shrink-0 size-16 items-center justify-center rounded-full bg-red-100/50 shadow-sm">
						<Icon name="circle-alert" className="size-8 text-red-600" />
					</div>
					<div>
						<AlertDialogTitle>{title || 'Eliminar'}</AlertDialogTitle>
						<AlertDialogDescription className="mt-1">
							{description ||
								'Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este elemento?'}
						</AlertDialogDescription>
					</div>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<deleteFetcher.Form method="POST" {...getFormProps(form)}>
						<FormFooter>
							<input {...getInputProps(fields.id, { type: 'hidden' })} />
							<input {...getInputProps(fields.intent, { type: 'hidden' })} />

							<FormRow>
								<AlertDialogCancel asChild></AlertDialogCancel>
								<AlertDialogAction asChild>
									<StatusButton
										variant="destructive"
										status={isPending ? 'pending' : (form.status ?? 'idle')}
										disabled={isPending}
										{...dc.getButtonProps({
											className: 'mx-auto',
											type: 'submit',
										})}
									>
										<Icon name="trash" />
										{dc.doubleCheck ? '¿Confirmar?' : 'Eliminar'}
									</StatusButton>
								</AlertDialogAction>
							</FormRow>
						</FormFooter>
					</deleteFetcher.Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

DeleteConfirmation.displayName = 'DeleteConfirmation'

export default DeleteConfirmation
