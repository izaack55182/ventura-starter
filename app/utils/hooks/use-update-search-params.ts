import { useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router'

type ParamValue = string | number | boolean | null | undefined | string[]

export default function useUpdateSearchParams() {
	const [searchParams] = useSearchParams()
	const location = useLocation()

	const updateSearchParams = useCallback(
		(params: Record<string, ParamValue>, opts?: { override?: boolean }) => {
			const newSearchParams = new URLSearchParams(opts?.override ? undefined : searchParams)

			for (const [key, value] of Object.entries(params)) {
				if (value === null || value === undefined || value === '') {
					newSearchParams.delete(key)
				} else if (Array.isArray(value)) {
					newSearchParams.delete(key)
					for (const v of value) {
						newSearchParams.append(key, String(v))
					}
				} else {
					newSearchParams.set(key, String(value))
				}
			}

			return newSearchParams.toString()
		},
		[searchParams]
	)

	const getCurrentPathWithParams = useCallback(() => {
		const search = searchParams.toString()
		return search ? `${location.pathname}?${search}` : location.pathname
	}, [location.pathname, searchParams])

	const getCurrentPath = useCallback(() => {
		return location.pathname
	}, [location.pathname])

	return {
		updateSearchParams,
		getCurrentPathWithParams,
		getCurrentPath,
	}
}
