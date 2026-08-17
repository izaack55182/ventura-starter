// CORE

import { type FieldMetadata, type FieldName, getInputProps, useField } from '@conform-to/react'
import {
	type ComponentProps,
	type ComponentPropsWithoutRef,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'
import { flushSync } from 'react-dom'
import { useFetcher } from 'react-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
// COMPONENTS
import { Input } from '@/components/ui/input'
// UTILS
import { cn } from '@/utils/misc'
import { Field, FieldError } from './field'

export function TextField({
	meta,
	labelProps,
	inputProps,
	icon,
	className,
	inputClassName,
	variant = 'default',
	size = 'default',
	orientation = 'vertical',
}: {
	meta: FieldMetadata<any, any, any> | undefined
	inputProps?: ComponentProps<typeof Input> & {
		type?: Parameters<typeof getInputProps>[1]['type']
	}
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	icon?: React.ReactNode
	className?: string
	inputClassName?: string
	variant?: ComponentProps<typeof Input>['variant']
	size?: ComponentProps<typeof Input>['size']
	orientation?: 'vertical' | 'horizontal'
}) {
	const fallbackId = useId()
	const [showPassword, setShowPassword] = useState(false)

	if (!meta) return null

	const isPassword = inputProps?.type === 'password'
	const id = meta.id ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined

	return (
		<Field
			meta={meta}
			labelProps={labelProps}
			className={className}
			variant={variant}
			orientation={orientation}
		>
			<div className={cn('relative', (icon || isPassword) && 'flex items-center')}>
				{icon && <div className="absolute left-3 text-muted-foreground z-10">{icon}</div>}
				<Input
					{...inputProps}
					variant={variant}
					size={size}
					{...getInputProps(meta, {
						type: isPassword ? (showPassword ? 'text' : 'password') : (inputProps?.type ?? 'text'),
						ariaAttributes: true,
					})}
					key={meta.id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					className={cn(icon && 'pl-10', isPassword && 'pr-10', inputClassName)}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
						tabIndex={-1}
					>
						<Icon name={showPassword ? 'eye-off' : 'eye'} className="size-4" />
					</button>
				)}
			</div>
			<FieldError id={errorId} errors={meta.errors} />
		</Field>
	)
}

export function TextEditable({
	intent,
	editableId,
	name,
	labelProps,
	inputProps,
	children,
	inputClassName,
	buttonClassName,
	className,
	buttonLabel,
	action,
}: {
	intent: string
	editableId: string | number
	name: FieldName<any>
	inputProps: ComponentPropsWithoutRef<typeof Input> & {
		type?: Parameters<typeof getInputProps>[1]['type']
	}
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	children?: React.ReactNode
	className?: string
	inputClassName?: string
	buttonClassName?: string
	buttonLabel?: string
	action?: string
}) {
	const [meta] = useField(name)
	const fetcher = useFetcher({ key: intent })
	const [edit, setEdit] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const originalValueRef = useRef<string>('')
	const [localValue, setLocalValue] = useState<string | undefined>(undefined)
	const fallbackId = useId()

	const fetcherError =
		fetcher.data && typeof fetcher.data === 'object' && 'error' in fetcher.data
			? [String(fetcher.data.error)]
			: fetcher.data && typeof fetcher.data === 'object' && 'errors' in (fetcher.data as any)
				? (fetcher.data as any).errors[name]
				: undefined

	const errors = fetcherError || meta.errors
	const hasError = !!errors?.length

	useEffect(() => {
		if (
			fetcher.data &&
			typeof fetcher.data === 'object' &&
			'status' in fetcher.data &&
			fetcher.data.status === 'error'
		) {
			setLocalValue(undefined)
		}
	}, [fetcher.data])

	if (!meta) return null

	const isSubmitting = fetcher.state !== 'idle'
	const id = meta.id ?? meta.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined

	const displayValue = localValue ?? inputProps.defaultValue ?? meta.value ?? meta.initialValue

	return (
		<Field meta={meta} labelProps={labelProps} className={className}>
			{edit ? (
				<div className="relative w-full">
					<input
						ref={inputRef}
						{...getInputProps(meta, {
							type: 'text',
							ariaAttributes: true,
						})}
						key={String(localValue ?? inputProps.defaultValue)}
						aria-invalid={errorId ? true : undefined}
						aria-describedby={errorId}
						className={cn(
							'w-full bg-transparent border-none outline-none p-0 m-0',
							'focus:ring-0 focus:outline-none focus-visible:ring-0',
							'no-scrollbar overflow-hidden selection:bg-transparent',
							hasError && 'text-destructive',
							inputClassName
						)}
						disabled={isSubmitting}
						defaultValue={displayValue as any}
						autoFocus
						onFocus={(e) => {
							originalValueRef.current = e.currentTarget.value
						}}
						onKeyDown={(event) => {
							if (event.key === 'Escape') {
								flushSync(() => {
									setEdit(false)
									setLocalValue(undefined) // Reset optimistic on cancel
								})
								buttonRef.current?.focus()
							}
							if (event.key === 'Enter') {
								event.currentTarget.blur()
							}
						}}
						onBlur={(event) => {
							const newValue = event.currentTarget.value

							// 1. Validación básica para evitar envíos vacíos si es requerido
							if (newValue.trim() === '' && originalValueRef.current !== '') {
								// Aquí podrías mostrar un error local antes de enviar
							}

							if (newValue !== originalValueRef.current) {
								setLocalValue(newValue) // Update local state immediately
								const formData = new FormData()
								formData.append(meta.name, newValue)
								formData.append('id', String(editableId))
								formData.append('intent', intent)
								fetcher.submit(formData, { method: 'POST', action })
							}

							flushSync(() => {
								setEdit(false)
							})
						}}
					/>
					{children}
				</div>
			) : (
				<Button
					variant="input"
					size="input"
					type="button"
					ref={buttonRef}
					disabled={isSubmitting}
					onClick={(event) => {
						event.stopPropagation()
						flushSync(() => {
							setEdit(true)
						})
						inputRef.current?.focus()
					}}
					aria-label={buttonLabel}
					className={cn(
						'w-full justify-start h-auto',
						buttonClassName,
						isSubmitting && 'opacity-60 cursor-wait',
						hasError && 'border-destructive/30 bg-destructive/5'
					)}
				>
					<div className="flex flex-col text-left w-full">
						<div className="flex items-center justify-between w-full">
							{displayValue ? (
								<span className={cn(hasError && 'text-destructive')}>{displayValue as any}</span>
							) : !errorId ? (
								<span className="text-muted-foreground">
									{inputProps.placeholder ?? 'Agregar...'}
								</span>
							) : (
								<span className="text-destructive opacity-50">Campo requerido</span>
							)}
							{hasError && <Icon name="circle-alert" className="size-3 text-destructive" />}
						</div>
						{children}
					</div>
				</Button>
			)}
			<FieldError id={errorId} errors={errors} />
		</Field>
	)
}
