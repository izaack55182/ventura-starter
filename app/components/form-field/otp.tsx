// CORE

// UTILS
import type { FieldMetadata } from '@conform-to/react'
import { type OTPInputProps, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useId } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
// COMPONENTS
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'

export function OTPField({
	meta,
	labelProps,
	inputProps,
	className,
}: {
	meta: FieldMetadata<string | null>
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	inputProps: Partial<OTPInputProps & { render: never }>
	className?: string
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = meta.errors?.length ? `${id}-error` : undefined
	return (
		<Field id={id} className={className}>
			<FieldLabel htmlFor={id} {...labelProps} />
			<InputOTP
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				maxLength={6}
				id={id}
				name={meta.name}
				defaultValue={meta.initialValue as string}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				{...inputProps}
			>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<FieldError id={errorId} errors={meta.errors} />
		</Field>
	)
}
