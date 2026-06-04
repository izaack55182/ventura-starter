import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta el árbol React entre tests para evitar fugas de DOM entre casos.
afterEach(() => {
	cleanup()
})
