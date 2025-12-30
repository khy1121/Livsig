import styles from './Hero.module.css'

function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroImage}>
                <img src="/hero_banner.png" alt="Luxury Living Lifestyle" />
            </div>
            <div className={styles.heroContent}>
                <h2 className={styles.heroTitle}>럭셔리 리빙 액세서리 쇼핑몰</h2>
                <p className={styles.heroSubtitle}>시그널에서 홈 스타일링을 시작하세요</p>
                <a href="#products" className={styles.btnPrimary}>컬렉션 보기</a>
            </div>
        </section>
    )
}

export default Hero
