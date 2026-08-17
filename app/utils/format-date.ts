import { addDays, addHours, format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { getTimeZone } from '@/utils/client-hints'

export function formatToNow(date: Date | string | number) {
	return formatDistanceToNow(new Date(date), {
		addSuffix: true,
		locale: es,
	})
}

export function formatDate(date: Date | string | number, formatStr = 'PP') {
	return format(new Date(date), formatStr, {
		locale: es,
	})
}

export function formatTime(date: Date | string | number, formatStr = 'HH:mm') {
	return format(new Date(date), formatStr, {
		locale: es,
	})
}

export function formatDateTime(date: Date | string | number, formatStr = 'PP, HH:mm') {
	return format(new Date(date), formatStr, {
		locale: es,
	})
}

export const formatRelativeDate = ({ date }: { date: Date | string | number }) => {
	const targetDate = new Date(date)
	const now = new Date()
	const diffInMs = targetDate.getTime() - now.getTime()

	const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

	const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
		{ unit: 'year', ms: 31536000000 },
		{ unit: 'month', ms: 2629800000 },
		{ unit: 'day', ms: 86400000 },
		{ unit: 'hour', ms: 3600000 },
		{ unit: 'minute', ms: 60000 },
	]

	for (const { unit, ms } of units) {
		if (Math.abs(diffInMs) >= ms || unit === 'minute') {
			return rtf.format(Math.round(diffInMs / ms), unit)
		}
	}
	return rtf.format(0, 'minute')
}

export function calculateExpirationDate(expiresAt: string) {
	const now = new Date()
	switch (expiresAt) {
		case 'never':
			return ''
		case '24h':
			return addHours(now, 24)
		case '7d':
			return addDays(now, 7)
		case '14d':
			return addDays(now, 14)
		case '30d':
			return addDays(now, 30)
		case '90d':
			return addDays(now, 90)
		default:
			return undefined
	}
}

function convertTz(date: string | Date | number, tzString: string) {
	const d = new Date(date)
	return new Date(d.toLocaleString('en-US', { timeZone: tzString }))
}

export function convertDateToUserTz(date: Date | string | number, request?: Request) {
	const tz = getTimeZone(request)
	return convertTz(date, tz)
}
