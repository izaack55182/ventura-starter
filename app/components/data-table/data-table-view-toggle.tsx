import { Link } from 'react-router'
// COMPONENTS
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'

// CONSTANTS
import { TABLE_VIEW } from './constants'

// TYPES
import type { TableViewType } from './types'

interface DataTableViewToggleProps {
	tableView: TableViewType
	setTableView: React.Dispatch<React.SetStateAction<TableViewType>>
}

export function DataTableViewToggle({ tableView, setTableView }: DataTableViewToggleProps) {
	const { updateSearchParams } = useUpdateSearchParams()

	const isRowView = tableView === TABLE_VIEW.ROW

	return (
		<Link
			to={{
				search: updateSearchParams({
					tableView: isRowView ? TABLE_VIEW.CARD : null,
				}),
			}}
			preventScrollReset
			prefetch="intent"
			className={buttonVariants({ variant: 'secondary', size: 'icon' })}
			onClick={() => {
				setTableView(isRowView ? TABLE_VIEW.CARD : TABLE_VIEW.ROW)
			}}
			title={isRowView ? 'Cambiar a vista de tarjetas' : 'Cambiar a vista de filas'}
		>
			<Icon name={isRowView ? 'monitor' : 'laptop'} />
			<span className="sr-only">
				{isRowView ? 'Cambiar a vista de tarjetas' : 'Cambiar a vista de filas'}
			</span>
		</Link>
	)
}
