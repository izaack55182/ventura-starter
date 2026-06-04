import { useEffect } from 'react'
import { toast as showToast } from 'sonner'
import type { Toast } from '@/utils/toast.server'
import { Toaster as SonnerToaster } from './ui/sonner'

export function EpicToaster({ toast }: { toast?: Toast | null }) {
	useEffect(() => {
		if (toast) {
			setTimeout(() => {
				const toastType = toast.type === 'message' ? showToast : showToast[toast.type]

				toastType(toast.title || toast.description, {
					id: toast.id,
					description: toast.title ? toast.description : undefined,
					action: toast.action
						? {
								label: toast.action.label,
								onClick: () => {
									if (toast.action?.url) {
										window.location.href = toast.action.url
									}
								},
							}
						: undefined,
				})
			}, 0)
		}
	}, [toast])

	return <SonnerToaster position="bottom-right" />
}
