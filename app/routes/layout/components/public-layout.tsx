// app/layouts/public-layout.tsx

// Header y Footer del template completo. Descomenta (y su import) para activarlos.
// import { Footer } from '@/routes/layout/components/public-footer'
// import { Header } from './public-header'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen overflow-x-clip">
			{/* <Header /> */}
			<main className="flex-1">{children}</main>
			{/* <Footer /> */}
		</div>
	)
}
