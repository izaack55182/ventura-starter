import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { NonceProvider } from '@/utils/nonce-provider'

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
