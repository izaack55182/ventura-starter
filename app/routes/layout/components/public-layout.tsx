import { Header } from './public-header'
// import { Footer } from '@/routes/layout/components/public-footer'
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen overflow-x-clip">
			<Header />
			<main className="flex-1 pt-16 md:pt-20">{children}</main>
			{/* <Footer /> */}
		</div>
	)
}
