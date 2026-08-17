import type { Table } from '@tanstack/react-table'

export function DataTableChart<TData>({
	children,
}: {
	table: Table<TData>
	children: React.ReactNode
}) {
	return <>{children}</>
}
