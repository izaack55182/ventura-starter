import {
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from 'date-fns'

const now = new Date()

export const presets = [
	{
		id: 1,
		label: 'Hoy',
		from: startOfDay(now),
		to: endOfDay(now),
		shortcut: 'd',
	},
	{
		id: 2,
		label: 'Ayer',
		from: startOfDay(subDays(now, 1)),
		to: endOfDay(subDays(now, 1)),
		shortcut: 'y',
	},
	{
		id: 3,
		label: 'Esta semana',
		from: startOfWeek(now, { weekStartsOn: 1 }),
		to: endOfWeek(now, { weekStartsOn: 1 }),
		shortcut: 'w',
	},
	{
		id: 4,
		label: 'Semana pasada',
		from: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
		to: endOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
		shortcut: 'w',
	},
	{
		id: 5,
		label: 'Este mes',
		from: startOfMonth(now),
		to: endOfDay(now),
		shortcut: 'm',
	},
	{
		id: 6,
		label: 'Mes pasado',
		from: startOfMonth(subMonths(now, 1)),
		to: endOfMonth(subMonths(now, 1)),
		shortcut: 'm',
	},
	{
		id: 7,
		label: 'Este año',
		from: startOfYear(now),
		to: endOfDay(now),
		shortcut: 'y',
	},
	{
		id: 8,
		label: 'Año pasado',
		from: startOfYear(subYears(now, 1)),
		to: endOfYear(subYears(now, 1)),
		shortcut: 't',
	},
	{
		id: 9,
		label: 'Últimos 3 años',
		from: startOfDay(subYears(now, 3)),
		to: endOfDay(now),
		shortcut: 't',
	},
	{
		id: 10,
		label: 'Todo el tiempo',
		from: startOfDay(new Date(2018, 0, 1)),
		to: endOfDay(now),
		shortcut: 'a',
	},
]
