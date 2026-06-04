import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'
import { cn } from '@/utils/misc'
import { Progress } from './ui/progress-bar'

/**
 * Standard progress bar component that appears during navigation.
 * Uses React Router's navigation state to determine when to show.
 */
export function EpicProgress() {
	const navigation = useNavigation()
	const [progress, setProgress] = useState(0)
	const isPending = navigation.state !== 'idle'

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>

		if (isPending) {
			setProgress(10)
			interval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) return prev
					return prev + 5
				})
			}, 200)
		} else {
			setProgress(100)
			const timeout = setTimeout(() => setProgress(0), 300)
			return () => clearTimeout(timeout)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isPending])

	if (progress === 0) return null

	return (
		<div
			className={cn(
				'fixed top-0 left-0 right-0 z-[9999] transition-opacity duration-300',
				isPending ? 'opacity-100' : 'opacity-0'
			)}
		>
			<Progress value={progress} className="h-0.5 rounded-none bg-transparent" />
		</div>
	)
}
