import { useState } from 'react'
import styles from './Header.module.css'

function Header({ searchTerm, onSearchChange, onNavClick, activeNav }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { id: 'new', label: 'New' },
        { id: 'best', label: 'Best' },
        { id: 'sale', label: 'Sale' },
        { id: 'collection', label: 'Collection' }
    ]

    const handleNavClick = (id) => {
        onNavClick(id)
        setIsMenuOpen(false)
    }

    return (
        <header className={styles.header} id="header">
            <div className="container">
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <h1>SIGNAL26</h1>
                    </div>

                    <nav className={styles.nav}>
                        <button
                            className={styles.navToggle}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle navigation"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <ul className={`${styles.navList} ${isMenuOpen ? styles.active : ''}`}>
                            {navItems.map(item => (
                                <li key={item.id}>
                                    <a
                                        href="#"
                                        className={`${styles.navLink} ${activeNav === item.id ? styles.active : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavClick(item.id)
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <input
                                type="search"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                aria-label="Search products"
                            />
                            <button type="submit" aria-label="Search">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                        <button className={styles.iconBtn} aria-label="User account">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                        <button className={styles.iconBtn} aria-label="Shopping cart">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
