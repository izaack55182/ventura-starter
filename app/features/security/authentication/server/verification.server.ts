import { createCookieSessionStorage } from 'react-router'
import { getServerEnv } from '@/utils/env.server'

export const verifySessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'kb_verification',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: getServerEnv().SESSION_SECRET.split(','),
		secure: getServerEnv().NODE_ENV === 'production',
		maxAge: 60 * 60 * 24,
	},
})
