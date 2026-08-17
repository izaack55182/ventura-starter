import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

/**
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref != null) {
		;(ref as React.MutableRefObject<T>).current = value
	}
}

/**
 */
function composeRefs<T>(...refs: PossibleRef<T>[]) {
	return (node: T) => {
		for (const ref of refs) {
			setRef(ref, node)
		}
	}
}

function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: El array de refs se pasa intencionalmente
	return React.useCallback(composeRefs(...refs), refs)
}

export { composeRefs, useComposedRefs }
