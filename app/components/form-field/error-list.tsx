import { motion } from 'framer-motion'
import { Icon } from '../ui/icon'

export function ErrorList({ errors, id }: { errors?: string[] | null; id?: string }) {
	if (!errors?.length) return null
	return (
		<motion.div
			id={id}
			initial={{ opacity: 0, y: -5 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col gap-1.5 mt-2"
		>
			{errors.map((error, i) => (
				<div
					key={i}
					className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
				>
					<Icon name="circle-alert" className="size-4 shrink-0 opacity-80" />
					<span className="text-[13px] font-medium tracking-tight">{error}</span>
				</div>
			))}
		</motion.div>
	)
}
