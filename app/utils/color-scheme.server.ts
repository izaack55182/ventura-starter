import { createCookie } from 'react-router'
import { ColorSchemeSchema } from '@/routes/resource/color-scheme'
import { getServerEnv } from './env.server'

const env = getServerEnv()

const cookie = createCookie('kb-color-scheme', {
	path: '/',
	sameSite: 'lax',
	httpOnly: true,
	secrets: [env.COOKIE_SECRET ?? 'secret'],
})

export async function getColorScheme(request: Request) {
	const raw = await cookie.parse(request.headers.get('Cookie'))
	const result = ColorSchemeSchema.safeParse(raw ?? undefined)
	return result.success ? result.data : 'light'
}

export async function setColorScheme(colorScheme: string) {
	return await cookie.serialize(colorScheme)
}
