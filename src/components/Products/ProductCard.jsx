import styles from './ProductCard.module.css'

function ProductCard({ product }) {
    const formatPrice = (price) => {
        return price.toLocaleString('ko-KR') + '원'
    }

    return (
        <article className={`${styles.productCard} ${product.isSoldOut ? styles.soldOut : ''}`}>
            <div className={styles.productImage}>
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>}
                {product.isBest && <span className={`${styles.badge} ${styles.badgeBest}`}>BEST</span>}
                {product.discount && <span className={`${styles.badge} ${styles.badgeDiscount}`}>{product.discount}%</span>}
                {product.isSoldOut && <div className={styles.soldOutOverlay}>품절</div>}
            </div>
            <div className={styles.productInfo}>
                <div className={styles.productCategoryLabel}>{product.category.toUpperCase()}</div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.nameEn}</p>
                <div className={styles.productPrice}>
                    <span className={styles.priceCurrent}>{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className={styles.priceOriginal}>{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
                <div className={styles.productTags}>
                    {product.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default ProductCard
