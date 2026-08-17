// UTILS
import { numericFormatter } from 'react-number-format'
import { formatPhoneNumber as formatPhoneNumberInput } from 'react-phone-number-input'
import { getNumericFormatProps } from '@/components/form-field/number'

const LOCALE = 'es-MX'

export const formatCurrency = (amount: number) => {
	return numericFormatter(amount.toString(), getNumericFormatProps('currency'))
}

export const formatNumberShort = (number: number) => {
	return new Intl.NumberFormat(LOCALE, {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(number)
}

export const formatCurrencyShort = (number: number) => {
	return new Intl.NumberFormat(LOCALE, {
		style: 'currency',
		currency: 'USD',
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(number)
}

export const formatNumber = (number: number) => {
	return new Intl.NumberFormat(LOCALE).format(number)
}

export const formatMileage = (number: number) => {
	return numericFormatter(number.toString(), getNumericFormatProps('mileage'))
}

export const formatAsPercent = (number: number) => {
	return numericFormatter(number.toString(), getNumericFormatProps('percentage'))
}

export const formatDecimalToPercentage = (number: number) => {
	const percentage = number * 100
	return numericFormatter(percentage.toString(), getNumericFormatProps('percentage'))
}

export const formatPhoneNumber = (phoneNumber?: string) => {
	if (!phoneNumber || phoneNumber.length < 10) return phoneNumber
	return formatPhoneNumberInput(phoneNumber)
}

export const formatSize = (bytes: number | string) => {
	const numericBytes = Number(bytes)
	if (Number.isNaN(numericBytes)) return '0 B'

	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		style: 'unit',
		unit: 'byte',
		unitDisplay: 'narrow',
		maximumFractionDigits: 1,
	}).format(numericBytes)
}

export const formatWhatsAppPhoneNumber = (phoneNumber?: string) => {
	if (!phoneNumber || phoneNumber.length < 10) return phoneNumber
	const formatted = formatPhoneNumberInput(phoneNumber)
	return formatted ? formatted.replace(/\D/g, '') : phoneNumber
}

export const formatStringAsNumber = (value: string) => {
	return value.replace(/\D/g, '')
}
