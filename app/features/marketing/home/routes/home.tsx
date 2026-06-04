import type { MetaFunction } from 'react-router'
import { getMeta } from '@/utils/misc'
import { BatteriesIncluded } from '../components/batteries-included'
import { CTA } from '../components/cta'
import { Deploy } from '../components/deploy'
import { Hero } from '../components/hero'
import { OrbitSection } from '../components/orbit-section'
import { Runtime } from '../components/runtime'
import { TerminalSection } from '../components/terminal-section'
import { UseCases } from '../components/use-cases'

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
			<Runtime />
			<UseCases />
			<OrbitSection />
			<BatteriesIncluded />
			<Deploy />
			<TerminalSection />
			<CTA />
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
