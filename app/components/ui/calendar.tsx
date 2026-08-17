// CORE

import { format } from 'date-fns'
import { enUS, type Locale } from 'date-fns/locale'
import * as React from 'react'
// COMPONENTS
import { DayPicker } from 'react-day-picker'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
// UTILS
import { cn } from '@/utils/misc'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// ---------- utils start ----------
function genMonths(locale: Pick<Locale, 'options' | 'localize' | 'formatLong'>) {
	return Array.from({ length: 12 }, (_, i) => ({
		value: i,
		label: format(new Date(2021, i), 'MMMM', { locale }),
	}))
}

function genYears(yearRange = 10) {
	const today = new Date()
	return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
		value: today.getFullYear() - yearRange + i,
		label: (today.getFullYear() - yearRange + i).toString(),
	}))
}
// ---------- utils end ----------

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	yearRange = 10,
	...props
}: CalendarProps & { yearRange?: number }) {
	// Calendar expansion from -> https://shadcnui-expansions.typeart.cc/docs/datetime-picker
	const MONTHS = React.useMemo(() => {
		let locale: Pick<Locale, 'options' | 'localize' | 'formatLong'> = enUS
		const { options, localize, formatLong } = props.locale || {}
		if (options && localize && formatLong) {
			locale = {
				options,
				localize,
				formatLong,
			}
		}
		return genMonths(locale)
	}, [props.locale])

	const YEARS = React.useMemo(() => genYears(yearRange), [yearRange])
	const disableLeftNavigation = () => {
		const today = new Date()
		const startDate = new Date(today.getFullYear() - yearRange, 0, 1)
		if (props.month) {
			return (
				props.month.getMonth() === startDate.getMonth() &&
				props.month.getFullYear() === startDate.getFullYear()
			)
		}
		return false
	}
	const disableRightNavigation = () => {
		const today = new Date()
		const endDate = new Date(today.getFullYear() + yearRange, 11, 31)
		if (props.month) {
			return (
				props.month.getMonth() === endDate.getMonth() &&
				props.month.getFullYear() === endDate.getFullYear()
			)
		}
		return false
	}

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 justify-center',
				month: 'flex flex-col items-center space-y-4',
				month_caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				button_previous: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-5 top-5',
					disableLeftNavigation() && 'pointer-events-none'
				),
				button_next: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-5 top-5',
					disableRightNavigation() && 'pointer-events-none'
				),
				month_grid: 'w-full border-collapse space-y-1',
				weekdays: cn('flex', props.showWeekNumber && 'justify-end'),
				weekday: 'text-muted-foreground rounded-md w-9 font-normal text-xs',
				weeks: '',
				week: 'flex w-full mt-2',
				day: 'p-0',
				outside: 'day-outside',
				range_middle: 'bg-accent last:rounded-e-md first:rounded-s-md',
				range_start: 'bg-accent rounded-s-md',
				range_end: 'bg-accent rounded-e-md',
				...classNames,
			}}
			components={{
				DayButton({ day, modifiers, className, ...buttonProps }) {
					return (
						<Button
							variant={'ghost'}
							className={cn(
								className,
								'h-9 w-9 p-0 font-normal',
								modifiers?.today && 'bg-accent text-accent-foreground',
								modifiers?.selected &&
									'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
								modifiers?.outside && 'text-muted-foreground opacity-50 pointer-events-none',
								modifiers?.disabled && 'opacity-50 text-muted-foreground',
								modifiers?.hidden && 'invisible',
								modifiers.range_middle &&
									'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-none last:rounded-e-md first:rounded-s-md',
								modifiers.outside && modifiers.selected && 'bg-accent/40 text-muted-foreground'
							)}
							{...buttonProps}
							aria-selected={modifiers.selected || buttonProps['aria-selected']}
							aria-disabled={modifiers.disabled || buttonProps['aria-disabled']}
							aria-hidden={modifiers.hidden || buttonProps['aria-hidden']}
						/>
					)
				},
				Chevron({ orientation, disabled, className }) {
					const iconName = orientation === 'left' ? 'chevron-left' : 'chevron-right'
					return (
						<Icon name={iconName} className={cn('w-4 h-4', className)} aria-disabled={disabled} />
					)
				},
				MonthCaption: ({ calendarMonth }) => {
					return (
						<div className="inline-flex gap-2">
							<Select
								defaultValue={calendarMonth.date.getMonth().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date)
									newDate.setMonth(Number.parseInt(value, 10))
									props.onMonthChange?.(newDate)
								}}
							>
								<SelectTrigger className="p-1 w-fit gap-1 bg-transparent text-xs shadow-none border-none">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MONTHS.map((month) => (
										<SelectItem key={month.value} value={month.value.toString()}>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								defaultValue={calendarMonth.date.getFullYear().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date)
									newDate.setFullYear(Number.parseInt(value, 10))
									props.onMonthChange?.(newDate)
								}}
							>
								<SelectTrigger className="p-1 w-fit gap-1 bg-transparent text-xs shadow-none border-none">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{YEARS.map((year) => (
										<SelectItem key={year.value} value={year.value.toString()}>
											{year.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				},
			}}
			{...props}
		/>
	)
}
Calendar.displayName = 'Calendar'

export { Calendar }
