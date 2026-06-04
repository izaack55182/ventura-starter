import { motion } from 'motion/react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { Container } from '@/components/ui/container'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/utils/misc'
import { USE_CASES_DATA } from '../constants'

export function UseCases() {
	return (
		<Container as="section" id="use-cases" variant="section" className="overflow-hidden">
			<div className="flex flex-col gap-12 md:gap-16">
				{/* Header */}
				<div className="flex flex-col gap-4 max-w-2xl">
					<span className="text-body-2xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
						Casos de uso
					</span>
					<motion.h2
						className="text-h2 md:text-h1 font-semibold tracking-tight text-foreground leading-tight"
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Imagínalo. Constrúyelo. Envíalo.
					</motion.h2>
				</div>

				{/* Carousel */}
				<Carousel opts={{ align: 'start', loop: false }} className="w-full">
					<CarouselContent className="-ml-4">
						{USE_CASES_DATA.map((uc, i) => (
							<CarouselItem key={uc.title} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: i * 0.06 }}
									className="h-full"
								>
									<div className="group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[24px] border border-border/60 bg-card-interactive p-6 transition-colors duration-300 hover:border-border md:p-8">
										{/* Top label */}
										<div className="flex items-center gap-2.5 text-muted-foreground">
											<Icon name={uc.icon} size="sm" className={cn(uc.iconColor)} />
											<span className="text-body-sm font-medium">{uc.title}</span>
										</div>

										{/* Bottom row: quote + plus button */}
										<div className="flex items-end justify-between gap-4">
											<p className="max-w-[80%] text-body-lg md:text-h4 font-semibold leading-snug tracking-tight text-foreground">
												“{uc.question}”
											</p>
											<button
												type="button"
												aria-label={`Ver más sobre ${uc.title}`}
												className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-300 group-hover:border-foreground/40 group-hover:text-foreground"
											>
												<span className="text-xl leading-none">+</span>
											</button>
										</div>
									</div>
								</motion.div>
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation */}
					<div className="mt-8 flex items-center justify-end gap-2">
						<CarouselPrevious className="static h-10 w-10 translate-x-0 translate-y-0" />
						<CarouselNext className="static h-10 w-10 translate-x-0 translate-y-0" />
					</div>
				</Carousel>
			</div>
		</Container>
	)
}
