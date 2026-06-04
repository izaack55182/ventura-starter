import type React from 'react'
import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/misc'

type ListOfErrors = Array<string | null | undefined> | null | undefined

/**
 * Renderiza la lista de errores de un campo Conform. Se asocia al input vía
 * `aria-describedby` (el `id` se expone como prop) para accesibilidad.
 */
export function ErrorList({ id, errors }: { id?: string; errors?: ListOfErrors }) {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null
	return (
		<ul id={id} className="flex flex-col gap-1">
			{errorsToRender.map((e) => (
				<li key={e} className="text-[0.7rem] font-medium text-destructive">
					{e}
				</li>
			))}
		</ul>
	)
}

/**
 * Campo de formulario integrado con Conform: label + input + lista de errores.
 * `inputProps` viene de `getInputProps(fields.x, { type })`; `errors` de `fields.x.errors`.
 */
export function Field({
	labelProps,
	inputProps,
	errors,
	className,
}: {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	inputProps: React.InputHTMLAttributes<HTMLInputElement>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	// Extraemos `children` para renderizarlos explícitamente: así la regla a11y
	// detecta el texto del label y su asociación con el input vía htmlFor.
	const { children: labelChildren, className: labelClassName, ...restLabel } = labelProps
	return (
		<div className={cn('space-y-2', className)}>
			<label
				htmlFor={id}
				{...restLabel}
				className={cn(
					'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
					labelClassName
				)}
			>
				{labelChildren}
			</label>
			<Input
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				{...inputProps}
			/>
			<div className="min-h-[1rem]">
				<ErrorList id={errorId} errors={errors} />
			</div>
		</div>
	)
}
