import { useState } from 'react'
import styles from './Footer.module.css'

function Footer() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('구독해 주셔서 감사합니다!')
            setEmail('')
        } else {
            alert('올바른 이메일 주소를 입력해주세요.')
        }
    }

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3 className={styles.footerLogo}>SIGNAL LIVING</h3>
                        <p className={styles.footerDesc}>
                            럭셔리 리빙 액세서리 쇼핑몰<br />감성적인 홈 스타일링을 제안합니다
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="https://www.instagram.com/signal_diffuser" target="_blank" rel="noopener" aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="4" fill="none" stroke="#F5F1ED" strokeWidth="2" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="#F5F1ED" />
                                </svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener" aria-label="Blog">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>고객센터</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#">공지사항</a></li>
                            <li><a href="#">자주 묻는 질문</a></li>
                            <li><a href="#">1:1 문의</a></li>
                            <li><a href="#">리뷰 이벤트</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>쇼핑 정보</h4>
                        <ul className={styles.footerLinks}>
                            <li><a href="#">배송 안내</a></li>
                            <li><a href="#">교환 및 반품</a></li>
                            <li><a href="#">이용약관</a></li>
                            <li><a href="#">개인정보처리방침</a></li>
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>뉴스레터</h4>
                        <p className={styles.newsletterDesc}>신상품 및 특별 할인 소식을 받아보세요</p>
                        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-label="Email address"
                            />
                            <button type="submit">구독</button>
                        </form>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.businessInfo}>
                        <p><strong>상호:</strong> SIGNAL LIVING | <strong>대표:</strong> 홍길동</p>
                        <p><strong>사업자등록번호:</strong> 123-45-67890 | <strong>통신판매업신고:</strong> 2024-서울강남-12345</p>
                        <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123</p>
                        <p><strong>이메일:</strong> contact@signalliving.com | <strong>전화:</strong> 02-1234-5678</p>
                    </div>
                    <p className={styles.copyright}>© 2024 SIGNAL LIVING. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
