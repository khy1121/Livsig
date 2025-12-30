import { useMemo } from 'react'
import ProductCard from './ProductCard'
import styles from './Products.module.css'

function Products({ products, activeCategory, showNewOnly, showSaleOnly, sortBy, searchTerm }) {
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Category filter
            if (activeCategory !== 'all' && product.category !== activeCategory) {
                return false
            }

            // New items filter
            if (showNewOnly && !product.isNew) {
                return false
            }

            // Sale items filter
            if (showSaleOnly && !product.isSale) {
                return false
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                const matchesName = product.name.toLowerCase().includes(searchLower)
                const matchesNameEn = product.nameEn.toLowerCase().includes(searchLower)
                const matchesTags = product.tags.some(tag => tag.toLowerCase().includes(searchLower))

                if (!matchesName && !matchesNameEn && !matchesTags) {
                    return false
                }
            }

            return true
        })

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'popular':
                    return (b.popularity || 0) - (a.popularity || 0)
                case 'newest':
                default:
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
            }
        })

        return filtered
    }, [products, activeCategory, showNewOnly, showSaleOnly, sortBy, searchTerm])

    return (
        <section className={styles.products} id="products">
            <div className="container">
                <div className={styles.sectionHeader}>
                    <h2 className="section-title">신상품</h2>
                    <p className="section-subtitle">New Arrivals</p>
                </div>

                {filteredAndSortedProducts.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>검색 결과가 없습니다.</p>
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Products
