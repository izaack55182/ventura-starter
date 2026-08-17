import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/misc'

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	columnsCount?: number
	columnSizes?: number[]
	rowsCount?: number
	variant?: 'all' | 'rows' | 'cards'
}

const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
	columnsCount = 5,
	columnSizes = [],
	rowsCount = 20,
	variant = 'all',
	className,
	...props
}) => {
	const renderRows = () => (
		<>
			{Array.from({ length: rowsCount }).map((_, i) => (
				<div key={i} className="flex w-full border-b last:border-0">
					{Array.from({ length: columnsCount }).map((_, j) => {
						const width = columnSizes?.[j]
						return (
							<div
								key={j}
								className="p-5"
								style={{
									width: width ? `${width}px` : '100%',
									flex: width ? 'none' : '1',
								}}
							>
								<Skeleton className="h-5 w-full max-w-[80%]" />
							</div>
						)
					})}
				</div>
			))}
		</>
	)

	const renderCards = () => (
		<>
			{Array.from({ length: rowsCount }).map((_, i) => (
				<Card key={i} className="overflow-hidden border">
					<CardHeader className="flex-row items-start justify-between">
						<div className="space-y-1.5">
							<Skeleton className="h-5 w-28" />
							<Skeleton className="h-4 w-40" />
						</div>
						<Skeleton className="h-6 w-20 rounded-full" />
					</CardHeader>

					<CardContent className="grid gap-3 p-4 pt-0">
						<div className="flex gap-2 rounded-md">
							<Skeleton className="size-10 shrink-0 rounded-md" />
							<div className="space-y-1 flex-1">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-full" />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="space-y-1 text-right">
								<Skeleton className="ml-auto h-3 w-16" />
								<Skeleton className="ml-auto h-4 w-20" />
							</div>
						</div>

						<div className="flex flex-wrap gap-1 pt-1">
							{Array.from({ length: 2 }).map((_, j) => (
								<Skeleton key={j} className="h-5 w-16 rounded-full" />
							))}
						</div>
					</CardContent>

					<CardFooter className="flex items-center justify-between border-t bg-muted/50 p-2">
						<Skeleton className="h-6 w-20 rounded-sm" />
						<Skeleton className="h-6 w-6 rounded-md" />
					</CardFooter>
				</Card>
			))}
		</>
	)

	if (variant === 'rows') return renderRows()
	if (variant === 'cards') return renderCards()

	return (
		<div className={cn('space-y-4', className)} {...props}>
			{/* Header skeleton */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-[250px]" />
				<Skeleton className="h-8 w-[200px]" />
			</div>

			{/* Table skeleton */}
			<div className="rounded-md border">
				<div className="border-b">
					<div
						className="grid gap-4 p-4"
						style={{ gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))` }}
					>
						{Array.from({ length: columnsCount }).map((_, i) => (
							<Skeleton key={i} className="h-4" />
						))}
					</div>
				</div>
				{renderRows()}
			</div>

			{/* Pagination skeleton */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-[100px]" />
				<Skeleton className="h-8 w-[200px]" />
			</div>
		</div>
	)
}

export { DataTableSkeleton }
