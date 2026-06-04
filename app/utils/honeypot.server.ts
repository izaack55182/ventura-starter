import { Honeypot, SpamError } from 'remix-utils/honeypot/server'
import { getServerEnv } from '@/utils/env.server'

export function getHoneypot() {
	const env = getServerEnv()
	const secret = env.HONEYPOT_SECRET
	const isProduction = env.NODE_ENV === 'production' || env.APP_ENV === 'production'

	const honey = new Honeypot({
		encryptionSeed: secret,
	})
	return honey
}

export async function checkHoneypot(formData: FormData) {
	const honeypot = getHoneypot()

	try {
		await honeypot.check(formData)
	} catch (error) {
		if (error instanceof SpamError) {
			console.warn('⚠️  HONEYPOT TRIGGERED - Reason: %s', error.message)
			throw new Response('Form not submitted properly', { status: 400 })
		}
		console.error('❌ HONEYPOT ERROR:', error instanceof Error ? error.message : error)
		throw error
	}
}
