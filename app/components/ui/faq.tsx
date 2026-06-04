import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { buildFAQSchema, JsonLd } from '@/utils/seo/json-ld'

/**
 * ─────────────────────────────────────────────────────────────
 *  FAQ — Sección de preguntas frecuentes con SEO automático
 *
 *  Renderiza un Accordion estilizado y, opcionalmente, inyecta
 *  el JSON-LD `FAQPage` schema para que Google muestre las
 *  preguntas/respuestas como rich results.
 *
 *  Uso:
 *  ```tsx
 *  const FAQ_ITEMS = [
 *    { question: '¿Cómo empiezo?', answer: 'Ejecuta bun run setup...' },
 *    { question: '¿Es gratuito?', answer: 'Sí, es open-source MIT.' },
 *  ]
 *
 *  <FAQ items={FAQ_ITEMS} />
 *  ```
 *
 *  Para desactivar el schema (e.g. si el FAQ aparece en
 *  una página noindex):
 *
 *  ```tsx
 *  <FAQ items={FAQ_ITEMS} withSchema={false} />
 *  ```
 * ─────────────────────────────────────────────────────────────
 */

export interface FAQItem {
	question: string
	answer: string
}

interface FAQProps {
	items: FAQItem[]
	/** Genera JSON-LD FAQPage automáticamente (default: true) */
	withSchema?: boolean
	/** Clase CSS adicional para el contenedor */
	className?: string
}

export function FAQ({ items, withSchema = true, className }: FAQProps) {
	if (items.length === 0) return null

	return (
		<>
			{withSchema && <JsonLd data={buildFAQSchema(items)} />}
			<Accordion type="single" collapsible className={className}>
				{items.map((item, i) => (
					<AccordionItem key={`faq-${i}`} value={`faq-${i}`}>
						<AccordionTrigger className="text-base font-semibold text-foreground">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</>
	)
}
