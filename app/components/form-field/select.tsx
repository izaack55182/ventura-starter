import { type FieldMetadata, unstable_useControl as useControl } from '@conform-to/react'
import { type ElementRef, useId, useRef } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/utils/misc'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

export function SelectField({
	meta,
	...props
}: {
	meta: FieldMetadata<any, any, any> | undefined
	options: {
		id: string | number
		label: string
		shortLabel?: string
		icon?: string
		iconName?: IconName
	}[]
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	placeholder?: string
	className?: string
	triggerClassName?: string
	contentClassName?: string
	variant?: 'settings' | 'default'
	disabled?: boolean
	orientation?: 'vertical' | 'horizontal'
	value?: string | number
	onValueChange?: (value: string) => void
}) {
	if (!meta) return null

	return <SelectFieldControl meta={meta} {...props} />
}

function SelectFieldControl({
	meta,
	options,
	labelProps,
	placeholder,
	className,
	triggerClassName,
	contentClassName,
	disabled,
	orientation = 'vertical',
	value,
	onValueChange,
}: {
	meta: FieldMetadata<any, any, any>
	options: {
		id: string | number
		label: string
		shortLabel?: string
		icon?: string
		iconName?: IconName
	}[]
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	placeholder?: string
	className?: string
	triggerClassName?: string
	contentClassName?: string
	variant?: 'settings' | 'default'
	disabled?: boolean
	orientation?: 'vertical' | 'horizontal'
	value?: string | number
	onValueChange?: (value: string) => void
}) {
	const triggerRef = useRef<ElementRef<typeof SelectTrigger>>(null)
	const fallbackId = useId()

	const control = useControl(meta as any)
	const id = meta.id ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined

	const currentValue = value ?? (control.value as string | number | undefined) ?? ''
	const selectedOption = options.find((o) => String(o.id) === String(currentValue))

	return (
		<Field
			id={id}
			className={cn(
				'w-full',
				className,
				orientation === 'horizontal' && 'flex flex-row items-center justify-between'
			)}
			orientation={orientation as any}
		>
			{/* Native hidden select for form submission */}
			<select
				name={meta.name}
				value={String(currentValue)}
				onChange={() => {}}
				className="sr-only"
				ref={control.register}
				aria-hidden
				tabIndex={-1}
				onFocus={() => {
					triggerRef.current?.focus()
				}}
			>
				<option value="" />
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{option.label}
					</option>
				))}
			</select>

			{labelProps && (
				<FieldLabel
					htmlFor={id}
					className={cn(orientation === 'horizontal' && 'w-1/3 flex-shrink-0')}
					{...labelProps}
				/>
			)}

			<div
				className={cn('relative w-full', orientation === 'horizontal' && 'flex-1 max-w-[250px]')}
			>
				<Select
					value={String(currentValue)}
					onValueChange={(nextValue) => {
						control.change(nextValue)
						onValueChange?.(nextValue)
					}}
					onOpenChange={(open) => {
						if (!open) {
							control.blur()
						}
					}}
					disabled={disabled}
				>
					<SelectTrigger ref={triggerRef} className={cn('w-full', triggerClassName)}>
						<SelectValue placeholder={placeholder ?? 'Seleccionar...'}>
							{selectedOption ? (
								<div className="flex items-center gap-2 truncate">
									{selectedOption.iconName ? (
										<Icon name={selectedOption.iconName} className="size-4 text-muted-foreground" />
									) : selectedOption.icon ? (
										<Avatar className="size-7 border-none bg-transparent">
											<AvatarImage src={selectedOption.icon} className="object-contain" />
											<AvatarFallback className="bg-transparent text-[10px]">
												{selectedOption.label.substring(0, 2)}
											</AvatarFallback>
										</Avatar>
									) : null}
									<span className="truncate">
										{selectedOption.shortLabel ?? selectedOption.label}
									</span>
								</div>
							) : null}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className={cn('max-h-60', contentClassName)}>
						<SelectGroup>
							{options.map((option) => (
								<SelectItem key={option.id} value={String(option.id)}>
									<div className="flex items-center gap-3 py-1">
										{option.iconName ? (
											<Icon name={option.iconName} className="size-4 text-muted-foreground" />
										) : option.icon ? (
											<Avatar className="size-7 border-none bg-transparent">
												<AvatarImage src={option.icon} className="object-contain" />
												<AvatarFallback className="bg-transparent text-[10px]">
													{option.label.substring(0, 2)}
												</AvatarFallback>
											</Avatar>
										) : null}
										<span className="font-medium">{option.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<FieldError id={errorId} errors={meta.errors} />
		</Field>
	)
}
