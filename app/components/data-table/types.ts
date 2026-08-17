import type React from 'react'
import type { z } from 'zod'
// COMPONENTS
import type { IconName } from '@/components/ui/icon'
// CONSTANTS
import type { TABLE_VIEW } from './constants'
// SCHEMAS
import type { baseFilterSchema } from './schemas'

export type SearchParams = Record<string, string | string[] | undefined>

export type Option = {
	label: string
	value: string | boolean | number
}

export type Base<TData> = {
	label: string
	value: keyof TData
	/** Defines if the accordion in the filter bar is open by default */
	defaultOpen?: boolean
	/** Defines if the command input is disabled for this field */
	commandDisabled?: boolean
	/** Shared options array for all filter fields that support choices */
	options?: Option[]
}

export type Input = {
	type: 'input'
}

export type Checkbox = {
	type: 'checkbox'
	component?: React.ComponentType<Option>
}

export type Select = {
	type: 'select'
}

export type Slider = {
	type: 'slider'
	min: number
	max: number
}

export type TimeRange = {
	type: 'timeRange'
}

export type Combobox = {
	type: 'combobox'
	comboboxType: 'client' | 'project' | 'user' | 'default'
	action: string
	icon?: IconName
}

export type DataTableCheckboxFilterField<TData> = Base<TData> & Checkbox
export type DataTableSliderFilterField<TData> = Base<TData> & Slider
export type DataTableInputFilterField<TData> = Base<TData> & Input
export type DataTableSelectFilterField<TData> = Base<TData> & Select
export type DataTableTimeRangeFilterField<TData> = Base<TData> & TimeRange
export type DataTableComboboxFilterField<TData> = Base<TData> & Combobox

export type DataTableFilterField<TData> =
	| DataTableCheckboxFilterField<TData>
	| DataTableSliderFilterField<TData>
	| DataTableInputFilterField<TData>
	| DataTableSelectFilterField<TData>
	| DataTableTimeRangeFilterField<TData>
	| DataTableComboboxFilterField<TData>

export type DataTableSearchParams = z.infer<typeof baseFilterSchema>

export type TableViewType = (typeof TABLE_VIEW)[keyof typeof TABLE_VIEW]
