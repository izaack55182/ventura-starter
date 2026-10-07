import type { Route } from '@/rr/features/marketing/home/routes/+types/home'
import { getMeta } from '@/utils/seo/meta'
import { Hero } from '../components/hero'

export async function loader() {
	return {
		title: 'Ventura Stack',
		description: 'El Stack Open-Source para la Web Edge',
	}
}

export default function Home() {
	return <Hero />
}

export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	return getMeta({
		title: loaderData?.title,
		description: loaderData?.description,
		matches,
		pathname: location.pathname,
	})
}
