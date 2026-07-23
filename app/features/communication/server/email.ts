import { render } from '@react-email/components'
import type { ReactElement } from 'react'

import { z } from 'zod'
import { getServerEnv } from '@/utils/env.server'

const env = getServerEnv()
const shouldMock = process.env.RESEND_API_KEY?.startsWith('MOCK_')

const resendErrorSchema = z.union([
	z.object({
		name: z.string(),
		message: z.string(),
		statusCode: z.number(),
	}),
	z.object({
		name: z.literal('UnknownError'),
		message: z.literal('Unknown Error'),
		statusCode: z.literal(500),
		cause: z.any(),
	}),
])

type ResendError = z.infer<typeof resendErrorSchema>

const resendSuccessSchema = z.object({
	id: z.string(),
})

export async function sendEmail({
	react,
	...options
}: {
	to: string
	subject: string
} & (
	| { html: string; text: string; react?: never }
	| { react: ReactElement; html?: never; text?: never }
)) {
	const from = 'Ventura <Hello@ventura.com>'
	const email = {
		from,
		...options,
		...(react ? await renderReactEmail(react) : null),
	}

	if (!process.env.RESEND_API_KEY || shouldMock) {
		console.error(`\n================= MOCK EMAIL =================`)
		console.error(`To: ${email.to}`)
		console.error(`Subject: ${email.subject}`)
		console.error(`\nBody:\n${email.text}`)
		console.error(`==============================================\n`)
		return {
			status: 'success',
			data: { id: 'mocked' },
		} as const
	}
	const response = await fetch('https://api.resend.com/email', {
		method: 'POST',
		body: JSON.stringify(email),
		headers: {
			Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
	})
	const data = await response.json()
	const parsedData = resendSuccessSchema.safeParse(data)

	if (response.ok && parsedData.success) {
		return {
			status: 'success',
			data: parsedData,
		} as const
	}
	const parseResult = resendErrorSchema.safeParse(data)
	if (parseResult.success) {
		return {
			status: 'error',
			error: parseResult.data,
		} as const
	}
	return {
		status: 'error',
		error: {
			name: 'UnknownError',
			message: 'Unknown Error',
			statusCode: 500,
			cause: data,
		} satisfies ResendError,
	} as const
}

async function renderReactEmail(react: ReactElement) {
	const [html, text] = await Promise.all([render(react), render(react, { plainText: true })])
	return { html, text }
}
