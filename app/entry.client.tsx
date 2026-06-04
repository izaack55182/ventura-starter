import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { NonceProvider } from '@/utils/nonce-provider'

// En cliente el nonce real no viaja (el navegador elimina el atributo del DOM tras
// aplicar la CSP). El NonceProvider con valor '' mantiene el árbol idéntico al del
// SSR para que la hidratación no genere mismatches.
startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<NonceProvider value="">
				<HydratedRouter />
			</NonceProvider>
		</StrictMode>
	)
})
