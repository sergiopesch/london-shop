import { describe, it, expect } from 'vitest'
import { getProduct, getProductsByCategory, searchProducts, getCategories } from './products'

describe('products', () => {
  describe('getProduct', () => {
    it('should return a product when given valid category and slug', () => {
      const product = getProduct('hoodies', 'hoodie-1')
      expect(product).toBeDefined()
      expect(product?.name).toBe('London Signature Hoodie')
    })

    it('should return undefined for non-existent product', () => {
      const product = getProduct('hoodies', 'non-existent')
      expect(product).toBeUndefined()
    })
  })

  describe('getProductsByCategory', () => {
    it('should return products for a valid category', () => {
      const products = getProductsByCategory('hoodies')
      expect(products.length).toBeGreaterThan(0)
      expect(products.every(p => p.categorySlug === 'hoodies')).toBe(true)
    })

    it('should return empty array for non-existent category', () => {
      const products = getProductsByCategory('non-existent')
      expect(products).toEqual([])
    })
  })

  describe('searchProducts', () => {
    it('should find products matching the query', () => {
      const results = searchProducts('hoodie')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should return empty array for no matches', () => {
      const results = searchProducts('xyz123notfound')
      expect(results).toEqual([])
    })

    it('should be case insensitive', () => {
      const results1 = searchProducts('LONDON')
      const results2 = searchProducts('london')
      expect(results1.length).toBe(results2.length)
    })
  })

  describe('getCategories', () => {
    it('should return all categories', () => {
      const categories = getCategories()
      expect(categories.length).toBeGreaterThan(0)
      expect(categories.some(c => c.slug === 'hoodies')).toBe(true)
      expect(categories.some(c => c.slug === 't-shirts')).toBe(true)
    })
  })
})
