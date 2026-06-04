import type { MetaFunction } from 'react-router'
import { getMeta } from '@/utils/misc'

export const meta: MetaFunction = ({ matches, location }: any) => {
	return getMeta({
		title: 'Contabilidad',
		description: 'Gestión financiera en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}

export default function Accounting() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Contabilidad</h1>
			<p className="text-muted-foreground">Módulo de gestión contable y financiera.</p>
		</div>
	)
}
