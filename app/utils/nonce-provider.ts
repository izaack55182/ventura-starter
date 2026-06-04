import { createContext, useContext } from 'react'

/**
 * Contexto que transporta el nonce CSP generado por petición (en `entry.server`)
 * hasta cualquier componente que renderice scripts inline (root → Document).
 *
 * En servidor el valor real viaja vía <NonceProvider>. En cliente el valor por
 * defecto es '' a propósito: el navegador elimina el atributo `nonce` del DOM tras
 * aplicar la política, así que React no necesita reinyectarlo durante la hidratación.
 */
const NonceContext = createContext<string>('')

export const NonceProvider = NonceContext.Provider

export function useNonce() {
	return useContext(NonceContext)
}
