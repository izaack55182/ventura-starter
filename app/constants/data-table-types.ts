// TYPES
import type { IconName } from '@/components/ui/icon'

export type ActionItem = {
	type: string
	label: string
	icon: IconName
	to?: string
	search?: string
	target?: string
	download?: boolean
	prefetch?: boolean
}

export const ACTION_TYPE = {
	EDIT: 'edit',
	NEW_TAB: 'new-tab',
	DELETE: 'delete',
	IMPERSONATE: 'impersonate',
	PDF: 'pdf',
	XML: 'xml',
	CUSTOM: 'custom',
	ACCEPT: 'accept',
} as const

type DATA_TABLE_ITEM = {
	value: string
	basePath: string
	title?: string
	editPermission?: string
}

const ACTION = {
	EDIT: {
		type: ACTION_TYPE.EDIT,
		label: 'Editar',
		icon: 'pencil',
		to: '/edit',
		prefetch: true,
	},
	NEW_TAB: {
		type: ACTION_TYPE.NEW_TAB,
		label: 'Abrir en pestaña nueva',
		icon: 'external-link',
		target: '_blank',
		prefetch: false,
	},
	DELETE: {
		type: ACTION_TYPE.DELETE,
		label: 'Eliminar',
		icon: 'trash',
		prefetch: false,
	},
	PDF: {
		type: ACTION_TYPE.PDF,
		label: 'PDF',
		icon: 'arrow-down-to-line',
		to: '/pdf',
		target: '_blank',
		prefetch: false,
	},
} as const satisfies Record<string, ActionItem>

export const DATA_TABLE_TYPE = {
	CLIENT: {
		value: 'client',
		basePath: '/m/clients/',
		title: 'Cliente',
		editPermission: 'customers.edit',
	},
	CLIENT_USER: {
		value: 'client-user',
		basePath: '/c/customers/user/',
		title: 'Cliente',
		editPermission: 'customers.edit',
	},
	AGENCY_MEMBER: {
		value: 'agency-member',
		basePath: '/c/members/',
		title: 'Miembro',
		editPermission: 'members.edit',
	},
	COMPANY: { value: 'company', basePath: '/m/companies/', title: 'Empresa' },
	USER: { value: 'user', basePath: '/m/users/', title: 'Usuario' },
	// ADMIN
	ADMIN_USER: { value: 'admin-user', basePath: '/a/users/', title: 'Usuario' },
	ADMIN_ORGANIZATION: {
		value: 'admin-organization',
		basePath: '/a/organizations/',
		title: 'Organización',
	},
} as const satisfies Record<string, DATA_TABLE_ITEM>

export const DATA_TABLE_ACTIONS = {
	CLIENT_USER: [ACTION.EDIT],
	AGENCY_MEMBER: [ACTION.EDIT],
	COMPANY: [ACTION.EDIT, ACTION.DELETE],
	USER: [ACTION.EDIT],
	ADMIN_USER: [ACTION.EDIT],
	ADMIN_ORGANIZATION: [ACTION.EDIT],
}
