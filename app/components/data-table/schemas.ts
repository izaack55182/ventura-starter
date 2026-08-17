import { endOfDay, startOfYear } from 'date-fns'
import { z } from 'zod'

export const ARRAY_DELIMITER = ','
export const SLIDER_DELIMITER = '-'
export const SPACE_DELIMITER = '_'
export const RANGE_DELIMITER = '-'

export const stringToBoolean = z
	.string()
	.toLowerCase()
	.transform((val) => {
		if (val === 'true') return true
		if (val === 'false') return false
		return undefined
	})
	.pipe(z.boolean().optional())

export const baseFilterSchema = z.object({
	offset: z.coerce.number().default(0),
	limit: z.coerce.number().max(10000).default(20),
	sortDirection: z.enum(['asc', 'desc']).default('desc'),
	sortColumn: z.string().optional(),
	search: z.string().optional(),
})

export const DEFAULT_DATE_RANGE = `${startOfYear(new Date()).toISOString()},${endOfDay(new Date()).toISOString()}`

export const dateRangeSchema = z.string().transform((val, ctx) => {
	const [fromStr, toStr] = val.split(ARRAY_DELIMITER)

	if (!fromStr || !toStr) {
		ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Faltan parámetros de fecha' })
		return z.NEVER
	}

	const from = new Date(fromStr)
	const to = new Date(toStr)

	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
		ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Formato de fecha inválido' })
		return z.NEVER
	}
	return { from, to }
})
export const sliderSchema = z.string().transform((val, ctx) => {
	const [minStr, maxStr] = val.split(SLIDER_DELIMITER)

	if (!minStr || !maxStr) {
		ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Faltan parámetros de rango' })
		return z.NEVER
	}

	const min = Number.parseFloat(minStr)
	const max = Number.parseFloat(maxStr)

	if (Number.isNaN(min) || Number.isNaN(max)) {
		ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Formato de rango inválido' })
		return z.NEVER
	}
	return { min, max }
})
