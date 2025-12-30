import styles from './FilterBar.module.css'

function FilterBar({
    activeCategory,
    onCategoryChange,
    showNewOnly,
    onNewOnlyChange,
    showSaleOnly,
    onSaleOnlyChange,
    sortBy,
    onSortChange
}) {
    const categories = [
        { id: 'all', label: 'All' },
        { id: 'pajamas', label: 'Pajamas' },
        { id: 'slippers', label: 'Slippers' },
        { id: 'aprons', label: 'Aprons' },
        { id: 'bedding', label: 'Bedding' },
        { id: 'accessories', label: 'Accessories' }
    ]

    return (
        <section className={styles.filterBar}>
            <div className="container">
                <div className={styles.filterContent}>
                    <div className={styles.filterCategories}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.filterChip} ${activeCategory === cat.id ? styles.active : ''}`}
                                onClick={() => onCategoryChange(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.filterOptions}>
                        <label className={styles.filterCheckbox}>
                            <input
                                type="checkbox"
                                checked={showNewOnly}
                                onChange={(e) => onNewOnlyChange(e.target.checked)}
                            />
                            <span>New items only</span>
                        </label>
                        <label className={styles.filterCheckbox}>
                            <input
                                type="checkbox"
                                checked={showSaleOnly}
                                onChange={(e) => onSaleOnlyChange(e.target.checked)}
                            />
                            <span>Sale items only</span>
                        </label>
                        <select
                            className={styles.filterSort}
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FilterBar
