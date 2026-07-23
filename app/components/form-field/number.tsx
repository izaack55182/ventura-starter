import {
	type FieldMetadata,
	type FieldName,
	getFormProps,
	unstable_useControl as useControl,
	useField,
} from '@conform-to/react'
import { type ComponentProps, type ComponentPropsWithoutRef, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'
import { useFetcher } from 'react-router'
import { Button } from '@/components/ui/button'

// COMPONENTS
import { Input } from '@/components/ui/input'
// UTILS
import { cn } from '@/utils/misc'
import { Field, FieldError } from './field'

export type NumberType = 'default' | 'decimal' | 'currency' | 'percentage' | 'integer' | 'mileage'

const FORMAT_CONFIGS: Record<NumberType, NumericFormatProps> = {
	currency: {
		thousandSeparator: true,
		decimalScale: 2,
		decimalSeparator: '.',
		prefix: '$',
		placeholder: '$0.00',
	},
	percentage: { suffix: '%', decimalScale: 2, decimalSeparator: '.', placeholder: '0%' },
	decimal: { decimalScale: 2, decimalSeparator: '.', placeholder: '0.00' },
	mileage: { thousandSeparator: true, decimalScale: 0, placeholder: '0 km', suffix: ' km' },
	integer: { thousandSeparator: false, decimalScale: 0, placeholder: '0' },
	default: { thousandSeparator: true, decimalScale: 0, placeholder: '0' },
}

export function getNumericFormatProps(numberType: NumberType): NumericFormatProps {
	// TODO: Localize the formatting of the numbers
	return FORMAT_CONFIGS[numberType] || FORMAT_CONFIGS.default
}

export function NumberField({
	meta,
	numberType = 'default',
	labelProps,
	inputProps,
	className,
	inputClassName,
	variant,
	onValueChange,
	onBlur,
}: {
	meta: FieldMetadata<any, any, any> | undefined
	numberType?: NumberType
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	inputProps?: Omit<ComponentProps<typeof Input>, 'value'> & {
		type?: 'password' | 'tel' | 'text'
		defaultValue?: string | number
		value?: string | number
	}
	className?: string
	inputClassName?: string
	variant?: string | null | undefined
	onBlur?: () => void
} & ComponentProps<typeof NumericFormat>) {
	const fallbackId = useId()
	const inputRef = useRef<HTMLInputElement>(null)

	// biome-ignore lint/suspicious/noExplicitAny: Required for generic meta
	const control = useControl(meta as any)

	if (!meta) return null

	const id = meta.id ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined

	const { size, ...restInputProps } = inputProps || {}

	return (
		<Field meta={meta} labelProps={labelProps} className={className} variant={variant}>
			<NumericFormat
				{...restInputProps}
				{...getNumericFormatProps(numberType)}
				id={id}
				customInput={Input as any}
				{...({ variant, size } as any)}
				getInputRef={inputRef}
				disabled={inputProps?.disabled}
				className={cn(inputClassName)}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				value={inputProps?.value ?? (meta.initialValue as any)}
				onValueChange={(values, source) => {
					control.change(values.value)
					onValueChange?.(values, source)
				}}
				onBlur={() => {
					control.blur()
					onBlur?.()
				}}
			/>
			<input
				className="sr-only"
				aria-hidden
				ref={control.register}
				name={meta.name}
				tabIndex={-1}
				defaultValue={meta.initialValue as any}
				onFocus={() => inputRef.current?.focus()}
			/>
			<FieldError id={errorId} errors={meta.errors} />
		</Field>
	)
}

export function NumberEditable({
	intent,
	editableId,
	name,
	labelProps,
	inputProps,
	numberType,
	children,
	inputClassName,
	buttonClassName,
	onValueChange,
	className,
	variant,
	action,
}: {
	intent: string
	editableId: number
	name: FieldName<string | number | null>
	numberType: NumberType
	inputProps: Omit<ComponentPropsWithoutRef<typeof Input>, 'type' | 'value' | 'defaultValue'> & {
		type?: 'text' | 'tel' | 'password'
		value?: string | number | null
		defaultValue?: string | number | null
	}
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	children?: React.ReactNode
	className?: string
	inputClassName?: string
	buttonClassName?: string
	variant?: string | null | undefined
	action?: string
} & ComponentProps<typeof NumericFormat>) {
	const [meta, form] = useField(name)
	const fetcher = useFetcher()

	const [edit, setEdit] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	// OPTIMISTIC UI CORRECTION: Nunca mutar las props directamente.
	const optimisticValue = fetcher.formData?.has(meta.name)
		? String(fetcher.formData.get(meta.name))
		: String(inputProps.defaultValue ?? '')

	const control = useControl({
		key: meta.key,
		initialValue: optimisticValue,
	})

	const [previousValue, setPreviousValue] = useState(optimisticValue)

	const fallbackId = useId()
	const id = meta.id ?? meta.name ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined
	const hasError = meta.errors ? meta.errors.length > 0 : false

	const { size, ...restInputProps } = inputProps || {}

	const handleFetcherSubmit = (
		event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
	) => {
		const currentValue = control.value || '0'

		if (!hasError && Number.parseFloat(currentValue) !== Number.parseFloat(previousValue)) {
			if (control.value === '') control.change('0')

			fetcher.submit(event.currentTarget.form)
			setPreviousValue(currentValue)
		}
	}

	return (
		<Field meta={meta} labelProps={labelProps} className={className} variant={variant}>
			{edit ? (
				<fetcher.Form
					{...getFormProps(form)}
					method="POST"
					action={action}
					onSubmit={(event) => {
						form.onSubmit(event)
						flushSync(() => setEdit(false))
						buttonRef.current?.focus()
					}}
				>
					<NumericFormat
						{...restInputProps}
						{...getNumericFormatProps(numberType)}
						id={id}
						customInput={Input as any}
						{...({ variant, size } as any)}
						getInputRef={inputRef}
						className={cn(inputClassName)}
						aria-invalid={errorId ? true : undefined}
						aria-describedby={errorId}
						value={optimisticValue}
						onValueChange={(values, source) => {
							control.change(values.value)
							onValueChange?.(values, source)
						}}
						onKeyDown={(event) => {
							if (event.key === 'Escape') {
								handleFetcherSubmit(event)
								flushSync(() => setEdit(false))
								buttonRef.current?.focus()
							}
						}}
						onBlur={(event) => {
							handleFetcherSubmit(event)
							control.blur()
							setEdit(false)
						}}
					/>
					<input
						className="sr-only"
						aria-hidden
						ref={control.register}
						name={meta.name}
						tabIndex={-1}
						defaultValue={optimisticValue}
						onFocus={() => inputRef.current?.focus()}
					/>
					<input type="hidden" name="intent" value={intent} />
					<input type="hidden" name="id" value={editableId} />
					{children}
					<FieldError id={errorId} errors={meta.errors} />
				</fetcher.Form>
			) : (
				<Button
					type="button"
					ref={buttonRef}
					onClick={(event) => {
						event.stopPropagation()
						flushSync(() => setEdit(true))
						inputRef.current?.select()
					}}
					disabled={inputProps.disabled}
					className={cn('w-full', buttonClassName)}
				>
					<div>
						<NumericFormat
							value={optimisticValue}
							displayType="text"
							renderText={(value) => <span>{value || inputProps.placeholder}</span>}
							{...getNumericFormatProps(numberType)}
						/>
						{children}
					</div>
					<FieldError id={errorId} errors={meta.errors} />
				</Button>
			)}
		</Field>
	)
}
