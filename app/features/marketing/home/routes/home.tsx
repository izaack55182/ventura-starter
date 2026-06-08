import type { MetaFunction } from 'react-router'
import { getMeta } from '@/utils/misc'
import { Hero } from '../components/hero'

export async function loader() {
	return {
		title: 'Ventura Stack',
		description: 'El Stack Open-Source para la Web Edge',
	}
}

export default function Home() {
	return (
		<>
			<Hero />
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
