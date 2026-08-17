// CORE
import { useEffect, useRef, useState } from 'react'
// UTILS
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
import { cn } from '@/utils/misc'

type WavyBackgroundProps = {
	children?: React.ReactNode
	className?: string
	containerClassName?: string
	colors?: string[]
	backgroundFill?: string
	blur?: number
	speed?: 'slow' | 'fast' | number
	waveOpacity?: number
	trail?: number
	ribbonWidth?: number
	waveAmplitude?: number
	waveFrequency?: number
}

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	backgroundFill,
	blur = 0,
	speed = 'slow',
	waveOpacity = 1,
	trail = 1,
	ribbonWidth = 0.24,
	waveAmplitude = 1,
	waveFrequency = 2,
}: WavyBackgroundProps) => {
	const noiseRef = useRef<NoiseFunction3D | null>(null)
	if (!noiseRef.current) noiseRef.current = createNoise3D()
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const stateRef = useRef({ nt: 0, animId: 0 })
	const [ready, setReady] = useState(false)

	const ribbonColors = colors ?? ['#8b5cf6', '#a855f7', '#d946ef', '#fb5d6b', '#fb923c', '#fde047']

	const half = (ribbonWidth * 100) / 2
	const start = 50 - half
	const stops = ribbonColors
		.map((color, i) => {
			const p = start + (i / Math.max(1, ribbonColors.length - 1)) * (half * 2)
			return `${color} ${p.toFixed(1)}%`
		})
		.join(', ')
	const placeholderGradient = `linear-gradient(to bottom right, transparent ${(start - 3).toFixed(1)}%, ${stops}, transparent ${(50 + half + 3).toFixed(1)}%)`

	const configRef = useRef({
		backgroundFill,
		colors: ribbonColors,
		waveOpacity,
		trail,
		blur,
		speed,
		ribbonWidth,
		waveAmplitude,
		waveFrequency,
	})
	configRef.current = {
		backgroundFill,
		colors: ribbonColors,
		waveOpacity,
		trail,
		blur,
		speed,
		ribbonWidth,
		waveAmplitude,
		waveFrequency,
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const state = stateRef.current

		const getSpeed = (): number => {
			const { speed } = configRef.current
			if (typeof speed === 'number') return speed
			return speed === 'fast' ? 0.0025 : 0.0013
		}

		const resize = () => {
			const parent = canvas.parentElement
			const nextW = parent?.clientWidth ?? window.innerWidth
			const nextH = parent?.clientHeight ?? window.innerHeight
			if (nextW === canvas.width && nextH === canvas.height) {
				ctx.filter = `blur(${configRef.current.blur}px)`
				return
			}
			canvas.width = nextW
			canvas.height = nextH
			ctx.filter = `blur(${configRef.current.blur}px)`
		}
		resize()
		const observer = new ResizeObserver(resize)
		if (canvas.parentElement) observer.observe(canvas.parentElement)

		const drawRibbon = () => {
			state.nt += getSpeed()
			const { width: w, height: h } = canvas
			const { colors, waveOpacity, ribbonWidth, waveAmplitude, waveFrequency } = configRef.current
			const n = colors.length
			const diag = Math.hypot(w, h)

			const ext = 0.2
			const sx = -ext * w
			const sy = (1 + ext) * h
			const ex = (1 + ext) * w
			const ey = -ext * h
			const dx = ex - sx
			const dy = ey - sy
			const len = Math.hypot(dx, dy)
			const perpX = -dy / len
			const perpY = dx / len

			const band = (diag * ribbonWidth) / n
			const amp = band * waveAmplitude

			ctx.globalCompositeOperation = 'source-over'
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
			ctx.globalAlpha = waveOpacity
			ctx.lineWidth = band + 1.5

			const steps = 48
			for (let i = 0; i < n; i++) {
				ctx.beginPath()
				ctx.strokeStyle = colors[i] ?? '#000000'
				const base = (i - (n - 1) / 2) * band
				for (let s = 0; s <= steps; s++) {
					const t = s / steps
					const noise = noiseRef.current?.(t * waveFrequency, i * 0.35, state.nt) ?? 0
					const off = base + noise * amp
					const x = sx + dx * t + perpX * off
					const y = sy + dy * t + perpY * off
					if (s === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.stroke()
			}
		}

		const paintFrame = () => {
			const { width: w, height: h } = canvas
			const { trail, backgroundFill } = configRef.current

			if (backgroundFill) {
				ctx.globalCompositeOperation = 'source-over'
				ctx.globalAlpha = trail
				ctx.fillStyle = backgroundFill
				ctx.fillRect(0, 0, w, h)
			} else if (trail >= 1) {
				ctx.clearRect(0, 0, w, h)
			} else {
				ctx.globalCompositeOperation = 'destination-out'
				ctx.globalAlpha = trail
				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, w, h)
			}

			drawRibbon()
		}

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		let inView = true
		let scrolling = false
		let running = false
		let scrollIdle: ReturnType<typeof setTimeout>

		const tick = () => {
			paintFrame()
			state.animId = requestAnimationFrame(tick)
		}
		const start = () => {
			if (running || prefersReducedMotion) return
			running = true
			state.animId = requestAnimationFrame(tick)
		}
		const stop = () => {
			running = false
			cancelAnimationFrame(state.animId)
		}
		const sync = () => {
			if (inView && !document.hidden && !scrolling) start()
			else stop()
		}

		const onScroll = () => {
			if (!scrolling) {
				scrolling = true
				sync()
			}
			clearTimeout(scrollIdle)
			scrollIdle = setTimeout(() => {
				scrolling = false
				sync()
			}, 120)
		}
		const onVisibility = () => sync()

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries.some((entry) => entry.isIntersecting)
				sync()
			},
			{ threshold: 0 }
		)
		io.observe(canvas)
		window.addEventListener('scroll', onScroll, { passive: true })
		document.addEventListener('visibilitychange', onVisibility)

		paintFrame()
		sync()
		let fadeRaf2 = 0
		const fadeRaf1 = requestAnimationFrame(() => {
			fadeRaf2 = requestAnimationFrame(() => setReady(true))
		})

		return () => {
			stop()
			cancelAnimationFrame(fadeRaf1)
			cancelAnimationFrame(fadeRaf2)
			clearTimeout(scrollIdle)
			io.disconnect()
			window.removeEventListener('scroll', onScroll)
			document.removeEventListener('visibilitychange', onVisibility)
			observer.disconnect()
		}
	}, [])

	return (
		<div className={cn('relative h-full w-full overflow-hidden', containerClassName)}>
			<div
				aria-hidden
				className={cn(
					'absolute inset-0 h-full w-full transition-opacity duration-700 ease-out',
					ready ? 'opacity-0' : 'opacity-100'
				)}
				style={{ backgroundImage: placeholderGradient }}
			/>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full transform-gpu" />
			{children ? <div className={cn('relative z-10', className)}>{children}</div> : null}
		</div>
	)
}
