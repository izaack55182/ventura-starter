// UTILS
import NumberFlow from '@number-flow/react'

type Props = {
	value: number
	isCurrency: boolean
	prefix?: string
	suffix?: string
	minimumFractionDigits?: number
	maximumFractionDigits?: number
	locale?: string
}

export function AnimatedNumber({
	value,
	isCurrency,
	prefix,
	suffix,
	minimumFractionDigits,
	maximumFractionDigits,
	locale: _locale,
}: Props) {
	let format = {}
	if (isCurrency) {
		format = {
			style: 'currency',
			currency: 'MXN',
			currencyDisplay: 'narrowSymbol',
			notation: 'compact',
			minimumFractionDigits,
			maximumFractionDigits,
		}
	} else if (prefix || suffix) {
		format = {
			style: 'number',
			notation: 'compact',
			minimumFractionDigits,
			maximumFractionDigits,
		}
	}

	return (
		<NumberFlow
			value={value}
			format={format}
			prefix={prefix}
			suffix={suffix}
			willChange
			// locales={localeToUse === 'es' ? 'es-MX' : localeToUse} // TODO: Find a permanent solution
		/>
	)
}
