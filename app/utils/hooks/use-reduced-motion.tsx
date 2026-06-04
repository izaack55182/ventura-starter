import { useEffect, useState } from 'react'

/**
 * Hook to detect if the user has requested reduced motion.
 * Useful for disabling intensive animations on mobile or for users with vestibular disorders.
 */
export function useReducedMotion() {
	const [reducedMotion, setReducedMotion] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setReducedMotion(mediaQuery.matches)

		const listener = (event: MediaQueryListEvent) => {
			setReducedMotion(event.matches)
		}

		mediaQuery.addEventListener('change', listener)
		return () => mediaQuery.removeEventListener('change', listener)
	}, [])

	return reducedMotion
}
