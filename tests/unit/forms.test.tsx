import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorList, Field } from '@/components/forms'

describe('ErrorList', () => {
	it('no renderiza nada sin errores', () => {
		const { container } = render(<ErrorList errors={[]} />)
		expect(container).toBeEmptyDOMElement()
	})

	it('renderiza los errores filtrando nulos', () => {
		render(<ErrorList errors={['Requerido', null, 'Demasiado corto']} />)
		expect(screen.getByText('Requerido')).toBeInTheDocument()
		expect(screen.getByText('Demasiado corto')).toBeInTheDocument()
	})
})

describe('Field', () => {
	it('marca el input como inválido y lo asocia a sus errores', () => {
		render(
			<Field
				labelProps={{ children: 'Email' }}
				inputProps={{ id: 'email', name: 'email', type: 'email' }}
				errors={['Email inválido']}
			/>
		)
		const input = screen.getByLabelText('Email')
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveAttribute('aria-describedby', 'email-error')
		expect(screen.getByText('Email inválido')).toBeInTheDocument()
	})

	it('no marca aria-invalid cuando no hay errores', () => {
		render(
			<Field
				labelProps={{ children: 'Email' }}
				inputProps={{ id: 'email', name: 'email', type: 'email' }}
			/>
		)
		expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
	})
})
