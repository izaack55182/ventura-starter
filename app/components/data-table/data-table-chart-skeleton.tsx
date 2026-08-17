// UTILS

import { Card, CardContent, CardHeader } from '@/components/ui/card'

// COMPONENTS
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/misc'

const LineChart = () => (
	<Card className="overflow-hidden">
		<CardHeader>
			<Skeleton className="h-5 w-12 mb-2" />
			<Skeleton className="h-8 w-28" />
		</CardHeader>
		<CardContent className="h-[150px] p-4">
			<div className="h-full w-full flex items-center">
				<svg
					className="h-full w-full opacity-50"
					preserveAspectRatio="none"
					viewBox="0 0 100 100"
					role="img"
				>
					<title>Line chart skeleton</title>
					<path
						d="M0 60 C 20 50, 40 80, 60 40 S 80 70, 100 30"
						className="stroke-muted-foreground/30 animate-pulse"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
				</svg>
			</div>
		</CardContent>
	</Card>
)

const PieChart = () => (
	<Card className="overflow-hidden">
		<CardHeader>
			<Skeleton className="h-5 w-28" />
		</CardHeader>
		<CardContent className="flex justify-center items-center h-[200px]">
			<Skeleton className="size-[150px] rounded-full" />
		</CardContent>
	</Card>
)

const BarChart = () => {
	const heights = ['h-[40%]', 'h-[80%]', 'h-[50%]', 'h-[100%]', 'h-[30%]', 'h-[70%]']

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<Skeleton className="h-5 w-28" />
			</CardHeader>
			<CardContent className="h-[200px] flex items-end gap-2 pb-0">
				{heights.map((h, i) => (
					<Skeleton key={i} className={`w-full rounded-t-sm rounded-b-none ${h}`} />
				))}
			</CardContent>
		</Card>
	)
}

const CountChart = () => (
	<Card className="min-h-[250px]">
		<CardHeader>
			<Skeleton className="h-5 w-12 mb-2" />
			<Skeleton className="h-8 w-28" />
		</CardHeader>
	</Card>
)

type ChartType = 'pie' | 'line' | 'bar' | 'count'

const CHART_MAP: Record<ChartType, React.FC> = {
	pie: PieChart,
	line: LineChart,
	bar: BarChart,
	count: CountChart,
}

interface DataTableChartSkeletonProps {
	variant?: ChartType[]
	className?: string
}

export const DataTableChartSkeleton: React.FC<DataTableChartSkeletonProps> = ({
	variant = ['pie', 'line', 'bar', 'count'],
	className,
}) => {
	return (
		<div className={cn('flex gap-4', className)}>
			{variant.map((chartType, index) => {
				const ChartComponent = CHART_MAP[chartType]
				return (
					<div className="flex-1" key={`${chartType}-${index}`}>
						{ChartComponent && <ChartComponent />}
					</div>
				)
			})}
		</div>
	)
}
