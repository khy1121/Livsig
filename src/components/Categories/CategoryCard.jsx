import styles from './CategoryCard.module.css'

function CategoryCard({ category, onClick }) {
    const icons = {
        shield: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
        ),
        slippers: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <ellipse cx="12" cy="18" rx="10" ry="4" />
                <path d="M12 14c5.52 0 10-1.79 10-4s-4.48-4-10-4-10 1.79-10 4 4.48 4 10 4z" />
            </svg>
        ),
        apron: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M6 6h12v12H6z" />
                <path d="M9 2h6M6 6l-2 2v10l2 2M18 6l2 2v10l-2 2" />
            </svg>
        ),
        bed: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M2 11h20M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
        )
    }

    return (
        <div className={styles.categoryCard} onClick={onClick}>
            <div className={styles.categoryIcon}>
                {icons[category.icon]}
            </div>
            <h3>{category.name}</h3>
            <p>{category.nameEn}</p>
        </div>
    )
}

export default CategoryCard
