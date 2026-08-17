import { addYears, endOfDay, startOfDay, subYears } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
// TYPES
import type { DateRange } from 'react-day-picker'
// COMPONENTS
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/format-date'
import { cn } from '@/utils/misc'
import { presets } from './date-picker-presets'
import { useDebounce } from './hooks/use-debounce'

export interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
	date: DateRange | undefined
	setDate: (date: DateRange | undefined) => void
	align?: 'start' | 'end' | 'center'
}

function adjustDateRange(range: DateRange | undefined): DateRange | undefined {
	if (!range?.from || !range?.to) return range
	return {
		from: startOfDay(range.from),
		to: endOfDay(range.to),
	}
}

export function DatePickerWithRange({
	align = 'start',
	className,
	date,
	setDate,
}: DatePickerWithRangeProps) {
	const [month, setMonth] = useState<Date>(date?.from ?? new Date())

	const handleRangeSelect = (range: DateRange | undefined) => {
		setDate(adjustDateRange(range))
	}

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						size="sm"
						className={cn(
							'max-w-full justify-start truncate text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<Icon name="calendar" className="mr-2" />
						{date?.from ? (
							date.to ? (
								<span className="truncate">
									{formatDate(date.from)} - {formatDate(date.to)}
								</span>
							) : (
								formatDate(date.from)
							)
						) : (
							<span>Seleccionar fecha</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align={align}>
					<div className="flex flex-col md:flex-row">
						<DatePresets onSelect={handleRangeSelect} selected={date} />
						<Separator orientation="vertical" className="hidden md:block h-auto w-[1px]" />
						<div className="relative">
							<Calendar
								mode="range"
								month={month}
								onMonthChange={setMonth}
								selected={date}
								onSelect={handleRangeSelect}
								numberOfMonths={1}
								locale={es}
								disabled={{
									before: subYears(new Date(), 10),
									after: addYears(new Date(), 10),
								}}
							/>
						</div>
					</div>
					<Separator />
					<CustomDateRange onSelect={handleRangeSelect} selected={date} />
				</PopoverContent>
			</Popover>
		</div>
	)
}

function DatePresets({
	selected,
	onSelect,
}: {
	selected: DateRange | undefined
	onSelect: (date: DateRange | undefined) => void
}) {
	return (
		<div className="flex flex-col gap-2 p-3 min-w-[160px]">
			<b className="mx-3 text-[10px] uppercase tracking-wider text-muted-foreground">
				Rangos rápidos
			</b>
			<div className="grid gap-1">
				{presets.map(({ id, label, from, to }) => {
					const isActive =
						selected?.from?.getTime() === from?.getTime() &&
						selected?.to?.getTime() === to?.getTime()
					return (
						<Button
							key={id}
							variant={isActive ? 'secondary' : 'ghost'}
							size="sm"
							onClick={() => onSelect({ from, to })}
							className="justify-start font-normal"
						>
							{label}
						</Button>
					)
				})}
			</div>
		</div>
	)
}

function CustomDateRange({
	selected,
	onSelect,
}: {
	selected: DateRange | undefined
	onSelect: (date: DateRange | undefined) => void
}) {
	const [dateFrom, setDateFrom] = useState<Date | undefined>(selected?.from)
	const [dateTo, setDateTo] = useState<Date | undefined>(selected?.to)
	const debouncedFrom = useDebounce(dateFrom, 500)
	const debouncedTo = useDebounce(dateTo, 500)

	const formatDateForInput = (date: Date | undefined): string => {
		if (!date) return ''
		const offset = date.getTimezoneOffset() * 60000
		return new Date(date.getTime() - offset).toISOString().slice(0, 16)
	}

	useEffect(() => {
		if (debouncedFrom || debouncedTo) {
			onSelect({ from: debouncedFrom, to: debouncedTo })
		}
	}, [debouncedFrom, debouncedTo, onSelect])

	// Actualizar estados locales si la selección cambia desde afuera (presets o calendario)
	useEffect(() => {
		setDateFrom(selected?.from)
		setDateTo(selected?.to)
	}, [selected])

	return (
		<div className="flex flex-col gap-2 p-3">
			<b className="text-[10px] uppercase tracking-wider text-muted-foreground">
				Rango personalizado
			</b>
			<div className="grid grid-cols-2 gap-3">
				<div className="grid gap-1.5">
					<Label htmlFor="from" className="text-xs">
						Inicio
					</Label>
					<Input
						type="datetime-local"
						id="from"
						value={formatDateForInput(dateFrom)}
						onChange={(e) => {
							const d = new Date(e.target.value)
							if (!Number.isNaN(d.getTime())) setDateFrom(d)
						}}
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="to" className="text-xs">
						Fin
					</Label>
					<Input
						type="datetime-local"
						id="to"
						value={formatDateForInput(dateTo)}
						onChange={(e) => {
							const d = new Date(e.target.value)
							if (!Number.isNaN(d.getTime())) setDateTo(d)
						}}
					/>
				</div>
			</div>
		</div>
	)
}
