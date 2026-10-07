// CORE

import {
	type FieldMetadata,
	type FieldName,
	getFormProps,
	unstable_useControl as useControl,
	useField,
} from '@conform-to/react'
import { type ElementRef, useEffect, useId, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
// COMPONENTS
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
	type ListOfErrors,
} from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// UTILS
import { cn } from '@/utils/misc'

export function SwitchField({
	name,
	labelProps,
	className,
	disabled,
	size = 'default',
}: {
	name: FieldName<boolean | string | null>
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	className?: string
	disabled?: boolean
	size?: 'sm' | 'default' | 'lg'
}) {
	const [meta, form] = useField(name)

	const fallbackId = useId()
	const id = meta.id ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined
	const switchRef = useRef<ElementRef<typeof Switch>>(null)
	const control = useControl(meta)
	return (
		<Field className={cn('flex-row justify-between items-center min-h-11 py-1', className)}>
			<FieldLabel
				className={cn(
					'text-[11px] font-bold text-foreground/70',
					disabled && 'opacity-50 cursor-not-allowed'
				)}
				htmlFor={id}
				{...labelProps}
			/>
			<FieldContent>
				<Switch
					id={id}
					ref={switchRef}
					checked={
						control.value === 'on' || control.value === '1' || String(control.value) === 'true'
					}
					onCheckedChange={(checked) => {
						const newValue =
							control.value === '1' || control.value === '0'
								? checked
									? '1'
									: '0'
								: checked
									? 'on'
									: 'false'
						control.change(newValue)
					}}
					disabled={disabled}
					size={size}
					aria-invalid={!!errorId}
					aria-describedby={errorId}
				/>
				<input
					name={meta.name}
					ref={control.register}
					defaultValue={meta.initialValue}
					className="sr-only"
					tabIndex={-1}
					onFocus={() => {
						switchRef.current?.focus()
					}}
				/>
				<FieldError id={errorId} errors={meta.errors} />
			</FieldContent>
		</Field>
	)
}

export function SwitchEditable({
	name,
	intent,
	editableId,
	labelProps,
	children,
	className,
	disabled,
}: {
	name: FieldName<boolean | string | null>
	intent: string
	editableId: number
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	children?: React.ReactNode
	className?: string
	disabled?: boolean
}) {
	const [meta, form] = useField(name)

	const fetcher = useFetcher()

	const formRef = useRef<HTMLFormElement>(null)
	const switchRef = useRef<ElementRef<typeof Switch>>(null)
	const fallbackId = useId()
	const id = meta.id ?? meta.name ?? fallbackId

	const control = useControl(meta)

	return (
		<div className={cn('w-full', className)}>
			<fetcher.Form {...getFormProps(form)} ref={formRef} method="POST">
				<Label
					className={cn('cursor-pointer', disabled && 'cursor-not-allowed opacity-50')}
					htmlFor={id}
					{...labelProps}
				>
					{labelProps.children}
					{meta.required && <span>&nbsp;*</span>}
				</Label>
				<Switch
					id={id}
					ref={switchRef}
					checked={
						control.value === 'on' || control.value === '1' || String(control.value) === 'true'
					}
					disabled={disabled}
					onCheckedChange={(checked) => {
						const newValue =
							control.value === '1' || control.value === '0'
								? checked
									? '1'
									: '0'
								: checked
									? 'on'
									: 'false'
						control.change(newValue)
						fetcher.submit(formRef.current)
					}}
					onBlur={control.blur}
				/>
				<input
					name={meta.name}
					ref={control.register}
					defaultValue={meta.initialValue}
					className="sr-only"
					tabIndex={-1}
					onFocus={() => {
						switchRef.current?.focus()
					}}
				/>
				<input type="hidden" name="intent" value={intent} />
				<input type="hidden" name="id" value={editableId} />
				{children}
			</fetcher.Form>
		</div>
	)
}

// TODO: REFACTOR OR REMOVE THIS COMPONENT

export function ReceptionSwitchEditable({
	meta,
	intent,
	editableId,
	labelProps,
	children,
	className,
	defaultValue: initialDefaultValue,
}: {
	meta: FieldMetadata<number | string | null>
	intent: string
	editableId: number
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	children?: React.ReactNode
	className?: string
	defaultValue?: string
}) {
	const fetcher = useFetcher()

	const formRef = useRef<HTMLFormElement>(null)
	const switchRef = useRef<ElementRef<typeof Switch>>(null)
	const fallbackId = useId()
	const id = meta.id ?? meta.name ?? fallbackId

	const control = useControl(meta)

	const [checked, setChecked] = useState(initialDefaultValue === '1')

	useEffect(() => {
		setChecked(initialDefaultValue === '1')
	}, [initialDefaultValue])

	return (
		<div className={cn('w-auto', className)}>
			<fetcher.Form
				ref={formRef}
				method="post"
				id={meta.formId}
				className="flex items-center justify-between"
			>
				<Label className="text-muted-foreground" htmlFor={id} {...labelProps}>
					{labelProps.children}
					{meta.required && <span>&nbsp;*</span>}
				</Label>
				<Switch
					id={id}
					ref={switchRef}
					checked={checked}
					onCheckedChange={(checked) => {
						setChecked(checked)
						control.change(checked ? '1' : '0')
						fetcher.submit(formRef.current)
					}}
					onBlur={control.blur}
				/>
				<input
					name={meta.name}
					ref={control.register}
					defaultValue={meta.initialValue}
					className="sr-only"
					tabIndex={-1}
					onFocus={() => {
						switchRef.current?.focus()
					}}
				/>
				<input type="hidden" name="intent" value={intent} />
				<input type="hidden" name="id" value={editableId} />
				{children}
			</fetcher.Form>
		</div>
	)
}

export function ToggleAllSwitchEditable({
	meta,
	editableId,
	categoryId,
	intent,
	errors,
	className,
	children,
}: {
	meta: FieldMetadata<number | string | null>
	editableId: number
	categoryId: number
	intent: string
	errors?: ListOfErrors
	className?: string
	children?: React.ReactNode
}) {
	const fetcher = useFetcher()
	const formRef = useRef<HTMLFormElement>(null)

	const control = useControl(meta)

	const fallbackId = useId()
	const id = meta.id ?? fallbackId ?? ''
	const errorId = errors?.length ? `${id}-error` : undefined
	const hoverEffect = 'hover:underline hover:text-primary hover:decoration-primary'
	return (
		<div className={cn('', className)}>
			<div className="flex w-full items-center justify-center">
				<fetcher.Form
					ref={formRef}
					method="post"
					id={meta.formId}
					onSubmit={(event) => {
						event.preventDefault()
						fetcher.submit(event.currentTarget)
					}}
				>
					<Tabs
						value={control.value}
						onValueChange={(value) => {
							control.change(value)
						}}
						onBlur={control.blur}
					>
						<TabsList>
							<TabsTrigger
								className={hoverEffect}
								onClick={() => {
									fetcher.submit(formRef.current)
								}}
								value="on"
							>
								{'Good condition'}
							</TabsTrigger>
							<TabsTrigger
								className={hoverEffect}
								onClick={() => {
									fetcher.submit(formRef.current)
								}}
								value="off"
							>
								{'Bad condition'}
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<input
						name={meta.name}
						ref={control.register}
						className="sr-only"
						tabIndex={-1}
						defaultValue={meta.initialValue}
						onFocus={control.focus}
					/>
					<input type="hidden" name="intent" value={intent} />
					<input type="hidden" name="categoryId" value={categoryId} />
					<input type="hidden" name="id" value={editableId} />
					{children}
				</fetcher.Form>
			</div>
		</div>
	)
}
