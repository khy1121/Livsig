import CategoryCard from './CategoryCard'
import { categories } from '../../data/categories'
import styles from './Categories.module.css'

function Categories({ onCategoryClick }) {
    return (
        <section className={styles.categories}>
            <div className="container">
                <h2 className="section-title">카테고리</h2>
                <div className={styles.categoryGrid}>
                    {categories.map(category => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onClick={() => {
                                onCategoryClick(category.id)
                                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories
