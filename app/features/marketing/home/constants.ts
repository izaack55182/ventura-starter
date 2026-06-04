export const USE_CASES_DATA = [
	{
		title: 'SaaS B2B',
		question: '¿Cómo lanzo mi plataforma de suscripción?',
		description:
			'Plataformas de suscripción, herramientas de flujo de trabajo y apps de gestión de proyectos. Autenticación, base de datos y facturación integradas.',
		icon: 'building-2' as const,
		iconColor: 'text-pink-500',
	},
	{
		title: 'Apps de Consumo',
		question: '¿Cómo escalo a millones de usuarios?',
		description:
			'Lanza redes sociales, sitios de comunidad y apps de bienestar con perfiles de usuario, feeds de actividad e interacciones dinámicas en tiempo real.',
		icon: 'smartphone' as const,
		iconColor: 'text-orange-500',
	},
	{
		title: 'E-commerce & Marketplaces',
		question: '¿Cómo cobro pagos sin fricción?',
		description:
			'Crea tiendas virtuales y marketplaces. Pasarela de pagos integrada, buscador optimizado y gestión de cuentas de cliente listos para usar.',
		icon: 'shopping-cart' as const,
		iconColor: 'text-amber-500',
	},
	{
		title: 'Landing Pages & Sitios Web',
		question: '¿Cómo consigo un sitio que cargue al instante?',
		description:
			'Diseña portafolios, páginas de lanzamiento y sitios corporativos con diseño excepcional, carga instantánea y optimización SEO nativa.',
		icon: 'globe' as const,
		iconColor: 'text-purple-500',
	},
	{
		title: 'Herramientas Internas',
		question: '¿Cómo doy datos en tiempo real a mi equipo?',
		description:
			'CRMs a medida, paneles de administración y dashboards analíticos en tiempo real. Empodera a tu equipo con los datos que necesita al instante.',
		icon: 'chart-bar-big' as const,
		iconColor: 'text-blue-500',
	},
	{
		title: 'Proyectos para Clientes',
		question: '¿Cómo entrego proyectos en tiempo récord?',
		description:
			'Entrega proyectos a tus clientes en tiempo récord. Agencias y profesionales independientes utilizan nuestro stack para lanzar productos listos para producción.',
		icon: 'users' as const,
		iconColor: 'text-muted-foreground',
	},
]

// --- Features section ---

export const STATS = [
	{ value: '10x', label: 'Builds más rápidos optimizados por Bun' },
	{ value: '0ms', label: 'Cold starts gracias al runtime Edge' },
	{ value: '300+', label: 'Nodos globales para desplegar tu app' },
]

// --- Terminal section ---

export const PILLARS = [
	{
		title: 'Un solo sistema para equipos y agentes',
		description:
			'El feedback, las decisiones y el código viven en el mismo lugar, así todos trabajan desde un contexto compartido.',
	},
	{
		title: 'De lo individual a resultados de equipo',
		description:
			'El stack acelera a cada desarrollador y garantiza que su trabajo se alinee con las prioridades del producto.',
	},
	{
		title: 'Operaciones de producto automatizadas',
		description:
			'Builds, previews y despliegues ocurren de forma automática, para que el equipo se enfoque en construir.',
	},
]

// --- Security section ---

export const SECURITY_FEATURES = [
	{
		title: 'Protección Edge Nativa',
		description:
			'Mitigación de ataques DDoS y WAF integrado gracias a la infraestructura global de Cloudflare.',
		icon: 'shield',
	},
	{
		title: 'Tipado End-to-End',
		description:
			'Validación estricta de datos con TypeScript y Zod desde el servidor hasta el cliente para prevenir inyecciones.',
		icon: 'code',
	},
	{
		title: 'Sesiones Blindadas',
		description:
			'Manejo seguro con cookies HTTPOnly, SameSite estrictas, y protección contra ataques CSRF/XSS por defecto.',
		icon: 'lock',
	},
	{
		title: 'Autenticación Robusta',
		description:
			'Integración lista para producción con OAuth (GitHub, Google) y hashing seguro de contraseñas.',
		icon: 'key',
	},
]

// --- CTA / Tech cards section ---

type CodeToken = [text: string, kind: 'base' | 'muted' | 'accent']

type TechCard = {
	name: string
	logo: string
	description: string
	cardClass: string
	titleClass: string
	descClass: string
	code: {
		label: string
		boxClass: string
		baseClass: string
		mutedClass: string
		accentClass: string
		lines: CodeToken[][]
	}
}

export const TECH_CARDS: TechCard[] = [
	{
		name: 'Bun',
		logo: '/images/brands/bun.svg',
		description: 'El runtime todo-en-uno. Instala, ejecuta y empaqueta a velocidad nativa.',
		cardClass: 'bg-gradient-to-br from-amber-50 to-amber-100',
		titleClass: 'text-zinc-900',
		descClass: 'text-zinc-600',
		code: {
			label: 'terminal',
			boxClass: 'bg-white/50 border-amber-200/70',
			baseClass: 'text-zinc-700',
			mutedClass: 'text-zinc-400',
			accentClass: 'text-amber-600',
			lines: [
				[
					['$ ', 'muted'],
					['bun install', 'base'],
				],
				[
					['$ ', 'muted'],
					['bun run ', 'base'],
					['dev', 'accent'],
				],
				[['→ ready in 8ms', 'muted']],
			],
		},
	},
	{
		name: 'TypeScript',
		logo: '/images/brands/typescript.svg',
		description: 'Tipado estático de extremo a extremo. Detecta errores antes de desplegar.',
		cardClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
		titleClass: 'text-white',
		descClass: 'text-blue-50/80',
		code: {
			label: 'app/types.ts',
			boxClass: 'bg-white/10 border-white/15',
			baseClass: 'text-blue-50',
			mutedClass: 'text-blue-200/60',
			accentClass: 'text-sky-200',
			lines: [
				[
					['type ', 'accent'],
					['Env', 'base'],
					[' = {', 'muted'],
				],
				[
					['  DB', 'base'],
					[': ', 'muted'],
					['D1Database', 'accent'],
				],
				[['}', 'muted']],
			],
		},
	},
	{
		name: 'React Router',
		logo: '/images/brands/reactrouter.svg',
		description: 'Enrutamiento full-stack con SSR, loaders y acciones listos para el Edge.',
		cardClass: 'bg-gradient-to-br from-rose-500 to-red-600',
		titleClass: 'text-white',
		descClass: 'text-rose-50/80',
		code: {
			label: 'app/routes/home.tsx',
			boxClass: 'bg-white/10 border-white/15',
			baseClass: 'text-rose-50',
			mutedClass: 'text-rose-200/60',
			accentClass: 'text-amber-200',
			lines: [
				[
					['export ', 'accent'],
					['async', 'accent'],
					[' loader', 'base'],
					['() {', 'muted'],
				],
				[
					['  return ', 'accent'],
					['data', 'base'],
				],
				[['}', 'muted']],
			],
		},
	},
]

// --- Developer Experience / Benchmark section ---

export type BenchmarkTab = 'bundler' | 'express' | 'postgres' | 'websockets'

type CompetitorData = {
	name: string
	version: string
	value: number
	formattedValue: string
	pct: number // percentage height for visual representation
	isWinner: boolean
	logoUrl?: string
}

type BenchmarkDetails = {
	id: BenchmarkTab
	label: string
	title: string
	subtitle: string
	unit: string
	competitors: CompetitorData[]
}

export const BENCHMARK_DATA: Record<BenchmarkTab, BenchmarkDetails> = {
	bundler: {
		id: 'bundler',
		label: 'Bundler',
		title: 'Compila en milisegundos',
		subtitle: 'Archivos empaquetados por segundo (10,000 módulos JS/TS)',
		unit: 'archivos/s',
		competitors: [
			{
				name: 'Bun',
				version: 'v1.2.22',
				value: 222222,
				formattedValue: '222,222',
				pct: 100,
				isWinner: true,
				logoUrl: '/images/brands/bun.svg',
			},
			{
				name: 'Node.js',
				version: 'v24.8.0',
				value: 8500,
				formattedValue: '8,500',
				pct: 8, // slight min-height for visibility
				isWinner: false,
			},
			{
				name: 'Deno',
				version: 'v2.5.1',
				value: 140000,
				formattedValue: '140,000',
				pct: 63,
				isWinner: false,
			},
		],
	},
	express: {
		id: 'express',
		label: 'Express',
		title: 'Servidor HTTP ultra-rápido',
		subtitle: 'Peticiones procesadas por segundo (Bun HTTP server vs Express en Node/Deno)',
		unit: 'req/s',
		competitors: [
			{
				name: 'Bun',
				version: 'v1.2.22',
				value: 52800,
				formattedValue: '52,800',
				pct: 100,
				isWinner: true,
				logoUrl: '/images/brands/bun.svg',
			},
			{
				name: 'Node.js',
				version: 'v24.8.0',
				value: 13400,
				formattedValue: '13,400',
				pct: 25.4,
				isWinner: false,
			},
			{
				name: 'Deno',
				version: 'v2.5.1',
				value: 29100,
				formattedValue: '29,100',
				pct: 55.1,
				isWinner: false,
			},
		],
	},
	postgres: {
		id: 'postgres',
		label: 'Postgres',
		title: 'Carga una tabla masiva',
		subtitle: 'Consultas por segundo. 100 filas x 100 consultas paralelas',
		unit: 'queries/s',
		competitors: [
			{
				name: 'Bun',
				version: 'v1.2.22',
				value: 28571,
				formattedValue: '28,571',
				pct: 100,
				isWinner: true,
				logoUrl: '/images/brands/bun.svg',
			},
			{
				name: 'Node.js',
				version: 'v24.8.0',
				value: 14522,
				formattedValue: '14,522',
				pct: 50.8,
				isWinner: false,
			},
			{
				name: 'Deno',
				version: 'v2.5.1',
				value: 11169,
				formattedValue: '11,169',
				pct: 39.1,
				isWinner: false,
			},
		],
	},
	websockets: {
		id: 'websockets',
		label: 'WebSockets',
		title: 'Tiempo real con alta concurrencia',
		subtitle: 'Mensajes por segundo con 10,000 conexiones websocket activas',
		unit: 'msg/s',
		competitors: [
			{
				name: 'Bun',
				version: 'v1.2.22',
				value: 1250000,
				formattedValue: '1,250,000',
				pct: 100,
				isWinner: true,
				logoUrl: '/images/brands/bun.svg',
			},
			{
				name: 'Node.js',
				version: 'v24.8.0',
				value: 410000,
				formattedValue: '410,000',
				pct: 32.8,
				isWinner: false,
			},
			{
				name: 'Deno',
				version: 'v2.5.1',
				value: 680000,
				formattedValue: '680,000',
				pct: 54.4,
				isWinner: false,
			},
		],
	},
}
