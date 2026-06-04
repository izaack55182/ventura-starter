import type { MetaFunction } from 'react-router'
import { getMeta } from '@/utils/misc'
import { SecurityVentura } from '../components/security-ventura'

export async function loader() {
	return {
		title: 'Security',
		description: 'Ventura',
	}
}

export default function SecurityRoute() {
	return (
		<>
			<SecurityVentura />
		</>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data, matches, location }: any) => {
	return getMeta({
		title: data?.title,
		description: data?.description,
		matches,
		pathname: location.pathname,
	})
}
