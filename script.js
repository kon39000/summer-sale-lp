// カウントダウンタイマー
function initCountdown() {
    // セール終了日時（2025年7月25日金曜日23:59）
    const endDate = new Date('2025-07-25T23:59:00+09:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p>セールは終了しました</p>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// スムーズスクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// FAQアコーディオン
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // すべてのFAQを閉じる
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
            });
            
            // クリックされたFAQを開く/閉じる
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// CTAリンクのトラッキング（オプション）
function initCTATracking() {
    const ctaLinks = document.querySelectorAll('.cta-link');
    
    ctaLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics等のトラッキングコードをここに追加可能
            console.log('CTA clicked:', this.querySelector('h3').textContent);
        });
    });
}

// モバイルメニュー
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // アニメーション
        const spans = this.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // メニューリンククリックで閉じる
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// スクロールアニメーション
function initScrollAnimation() {
    const animateElements = document.querySelectorAll('.course-card, .review-card, .faq-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// クーポンコードのコピー機能
function initCouponCopy() {
    const couponCode = document.getElementById('couponCode');
    const copyButton = document.getElementById('copyButton');
    const copyFeedback = document.getElementById('copyFeedback');
    const codeText = document.querySelector('.code-text');
    
    if (!couponCode || !copyButton || !copyFeedback || !codeText) return;
    
    // クーポンコード全体をクリック可能にする
    couponCode.addEventListener('click', copyToClipboard);
    
    // コピーボタンのクリックイベント（バブリングを防ぐ）
    copyButton.addEventListener('click', function(e) {
        e.stopPropagation();
        copyToClipboard();
    });
    
    function copyToClipboard() {
        const code = codeText.textContent;
        
        // クリップボードにコピー
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 新しいClipboard API
            navigator.clipboard.writeText(code).then(function() {
                showCopyFeedback();
            }).catch(function(err) {
                // フォールバック
                fallbackCopyToClipboard(code);
            });
        } else {
            // 古いブラウザ向けのフォールバック
            fallbackCopyToClipboard(code);
        }
    }
    
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            console.error('コピーに失敗しました:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback() {
        // フィードバックを表示
        copyFeedback.classList.add('show');
        
        // ボタンのテキストを一時的に変更
        const buttonText = copyButton.querySelector('.button-text');
        const originalText = buttonText.textContent;
        buttonText.textContent = 'コピー済み';
        
        // 2秒後に元に戻す
        setTimeout(function() {
            copyFeedback.classList.remove('show');
            buttonText.textContent = originalText;
        }, 2000);
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initSmoothScroll();
    initFAQ();
    initCTATracking();
    initMobileMenu();
    initScrollAnimation();
    initCouponCopy();
});

// モバイルメニュー用の追加CSS
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background-color: white;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transform: translateX(-100%);
            transition: transform 0.3s;
        }
        
        .nav.active {
            transform: translateX(0);
        }
        
        .nav-list {
            flex-direction: column;
            padding: 2rem;
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);