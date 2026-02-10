/* ========================================
   StreamingBlck - JavaScript Application
   ======================================== */

// Platform Data - packageIds por período (Centralcart)
const platforms = {
    netflix: {
        name: 'Netflix',
        price: 12.90,
        icon: 'N',
        iconClass: 'netflix-icon',
        packageIds: { monthly: 428773, quarterly: 428931 },
        priceByPeriod: { monthly: 12.90, quarterly: 12.90 * 2, semiannual: 12.90 * 4, annual: 12.90 * 7 }
    },
    disney: {
        name: 'Disney+',
        price: 12.90,
        icon: 'D+',
        iconClass: 'disney-icon',
        packageIds: { monthly: 428864, quarterly: 428932 },
        priceByPeriod: { monthly: 12.90, quarterly: 12.90 * 2, semiannual: 12.90 * 4, annual: 12.90 * 7 }
    },
    hbo: {
        name: 'HBO Max',
        price: 9.90,
        icon: 'HBO',
        iconClass: 'hbo-icon',
        packageIds: { monthly: 428865, quarterly: 428941 },
        priceByPeriod: { monthly: 9.90, quarterly: 9.90 * 2, semiannual: 9.90 * 4, annual: 9.90 * 7 }
    },
    viki: {
        name: 'Viki Pass',
        price: 9.90,
        icon: 'V',
        iconClass: 'viki-icon',
        packageIds: { monthly: 428873, quarterly: 428945 },
        priceByPeriod: { monthly: 9.90, quarterly: 9.90 * 2, semiannual: 9.90 * 4, annual: 9.90 * 7 }
    },
    youku: {
        name: 'Youku',
        price: 7.90,
        icon: 'Y',
        iconClass: 'youku-icon',
        packageIds: { monthly: 428880, quarterly: 428984 },
        priceByPeriod: { monthly: 7.90, quarterly: 7.90 * 2, semiannual: 7.90 * 4, annual: 7.90 * 7 }
    },
    iqiyi: {
        name: 'IQIYI',
        price: 9.90,
        icon: 'iQ',
        iconClass: 'iqiyi-icon',
        packageIds: { monthly: 428883, quarterly: 428947 },
        priceByPeriod: { monthly: 9.90, quarterly: 9.90 * 2, semiannual: 9.90 * 4, annual: 9.90 * 7 }
    },
    kocowa: {
        name: 'Kocowa+',
        price: 7.90,
        icon: 'K+',
        iconClass: 'kocowa-icon',
        packageIds: { monthly: 428889, quarterly: 428989 },
        priceByPeriod: { monthly: 7.90, quarterly: 7.90 * 2, semiannual: 7.90 * 4, annual: 7.90 * 7 }
    },
    reelshorts: {
        name: 'ReelShorts',
        price: 12.90,
        icon: 'RS',
        iconClass: 'reelshorts-icon',
        packageIds: { monthly: 428892, quarterly: 428933 },
        priceByPeriod: { monthly: 12.90, quarterly: 12.90 * 2, semiannual: 12.90 * 4, annual: 12.90 * 7 }
    },
    dramawave: {
        name: 'DramaWave',
        price: 12.90,
        icon: 'DW',
        iconClass: 'dramawave-icon',
        packageIds: { monthly: 428897, quarterly: 428937 },
        priceByPeriod: { monthly: 12.90, quarterly: 12.90 * 2, semiannual: 12.90 * 4, annual: 12.90 * 7 }
    }
};

// Period Discounts
const periodDiscounts = {
    monthly: { discount: 0, months: 1, label: 'Mensal' },
    quarterly: { discount: 0, months: 3, label: 'Trimestral' },
    semiannual: { discount: 0, months: 6, label: 'Semestral' },
    annual: { discount: 0, months: 12, label: 'Anual' }
};

// Centralcart API Configuration
const CENTRALCART_CONFIG = {
    apiUrl: 'https://api.centralcart.com.br/v1/app/checkout',
    apiKey: 'd11b3ea6-1430-4736-9991-b20036139a49'
};

// State
let cart = [];
let currentPeriod = 'monthly';
let userData = null;
let currentPayment = null;

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDiscount = document.getElementById('cartDiscount');
const discountPercent = document.getElementById('discountPercent');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const registerModal = document.getElementById('registerModal');
const registerClose = document.getElementById('registerClose');
const registerForm = document.getElementById('registerForm');

const paymentModal = document.getElementById('paymentModal');
const paymentClose = document.getElementById('paymentClose');
const paymentAmount = document.getElementById('paymentAmount');
const paymentTimer = document.getElementById('paymentTimer');
const copyPixKey = document.getElementById('copyPixKey');
const backToCart = document.getElementById('backToCart');
const confirmPayment = document.getElementById('confirmPayment');

const successModal = document.getElementById('successModal');
const successEmail = document.getElementById('successEmail');
const successWhatsapp = document.getElementById('successWhatsapp');
const successClose = document.getElementById('successClose');

const termsModal = document.getElementById('termsModal');
const termsLink = document.getElementById('termsLink');
const termsClose = document.getElementById('termsClose');

const privacyModal = document.getElementById('privacyModal');
const privacyLink = document.getElementById('privacyLink');
const privacyClose = document.getElementById('privacyClose');

const refundModal = document.getElementById('refundModal');
const refundLink = document.getElementById('refundLink');
const refundClose = document.getElementById('refundClose');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// ========================================
// Utility Functions
// ========================================

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatPrice(value) {
    return value.toFixed(2).replace('.', ',');
}

// ========================================
// Period Selection
// ========================================

const periodButtons = document.querySelectorAll('.period-btn');

periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        periodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        updatePlanPrices();
        updateCartPeriod();
    });
});

function updatePlanPrices() {
    const period = periodDiscounts[currentPeriod];

    document.querySelectorAll('.plan-card').forEach(card => {
        const platformId = card.dataset.platform;
        const platform = platforms[platformId];
        const priceForPeriod = platform?.priceByPeriod?.[currentPeriod];
        const priceValueNumber = typeof priceForPeriod === 'number'
            ? priceForPeriod
            : (platform.price * period.months);

        const priceValue = card.querySelector('.price-value');
        const pricePeriod = card.querySelector('.price-period');

        if (currentPeriod === 'monthly') {
            priceValue.textContent = formatPrice(platform.priceByPeriod.monthly);
            pricePeriod.textContent = '/mês';
        } else {
            priceValue.textContent = formatPrice(priceValueNumber);
            pricePeriod.textContent = `/${period.label.toLowerCase()}`;
        }
    });
}

function updateCartPeriod() {
    const period = periodDiscounts[currentPeriod];
    cart = cart.map(item => {
        const platform = platforms[item.platformId];
        const priceMap = platform.priceByPeriod || {};
        const price = typeof priceMap[currentPeriod] === 'number'
            ? priceMap[currentPeriod]
            : (platform.price * period.months);
        return {
            ...item,
            period: currentPeriod,
            periodLabel: period.label,
            price
        };
    });
    updateCartUI();
    saveCart();
}
// ========================================
// Cart Functions
// ========================================

function addToCart(platformId) {
    const platform = platforms[platformId];

    // Check if already in cart with same period
    const existingIndex = cart.findIndex(item =>
        item.platformId === platformId && item.period === currentPeriod
    );

    if (existingIndex > -1) {
        // Remove if already exists (toggle behavior)
        cart.splice(existingIndex, 1);
        showNotification(`${platform.name} removido do carrinho`);
    } else {
        // Add new item
        const period = periodDiscounts[currentPeriod];
        const priceMap = platform.priceByPeriod || {};
        const price = typeof priceMap[currentPeriod] === 'number'
            ? priceMap[currentPeriod]
            : (platform.price * period.months);

        cart.push({
            platformId,
            platform: platform.name,
            period: currentPeriod,
            periodLabel: period.label,
            price,
            icon: platform.icon,
            iconClass: platform.iconClass
        });

        showNotification(`${platform.name} adicionado ao carrinho!`);
    }

    updateCartUI();
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    // Update cart count
    cartCount.textContent = cart.length;

    // Show/hide empty state
    if (cart.length === 0) {
        cartEmpty.classList.add('active');
        cartSummary.classList.remove('active');
        cartItems.innerHTML = '';
    } else {
        cartEmpty.classList.remove('active');
        cartSummary.classList.add('active');
        renderCartItems();
        calculateTotals();
    }

    // Update add to cart buttons
    updateAddToCartButtons();
}

function renderCartItems() {
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-icon ${item.iconClass}">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.platform}</div>
                <div class="cart-item-period">${item.periodLabel}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">✕</button>
        </div>
    `).join('');
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal;
    cartSubtotal.textContent = formatCurrency(subtotal);
    discountPercent.textContent = 0;
    cartDiscount.textContent = `- ${formatCurrency(0)}`;
    cartTotal.textContent = formatCurrency(total);
}

function updateAddToCartButtons() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        const platformId = btn.dataset.platform;
        const isInCart = cart.some(item =>
            item.platformId === platformId && item.period === currentPeriod
        );

        if (isInCart) {
            btn.classList.add('added');
            btn.querySelector('span').textContent = 'Adicionado ✓';
            btn.querySelector('.btn-icon').textContent = '✓';
        } else {
            btn.classList.remove('added');
            btn.querySelector('span').textContent = 'Adicionar ao Carrinho';
            btn.querySelector('.btn-icon').textContent = '+';
        }
    });
}

// Add to cart button listeners
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        addToCart(btn.dataset.platform);
    });
});

// Cart sidebar toggle
cartBtn.addEventListener('click', () => {
    openCart();
});

cartClose.addEventListener('click', () => {
    closeCart();
});

cartOverlay.addEventListener('click', () => {
    closeCart();
});

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close cart when clicking nav links in mobile menu
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// ========================================
// Checkout Flow
// ========================================

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    closeCart();
    openModal(registerModal);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const whatsapp = document.getElementById('userWhatsapp').value.trim();

    if (!name || !email || !whatsapp) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    userData = { name, email, whatsapp };
    saveUserData();

    closeModal(registerModal);
    openPaymentModal();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// Centralcart PIX API Integration
// ========================================

async function createPixPayment(total, cartItems, customer) {
    // Build cart with package_ids por período (Centralcart)
    const periodQty = { monthly: 1, quarterly: 2, semiannual: 4, annual: 7 };
    const cartData = cartItems.reduce((acc, item) => {
        const platform = platforms[item.platformId];
        const pkgId = platform?.packageIds?.monthly || platform?.packageId;
        const qty = periodQty[item.period] || 1;
        if (!pkgId) return acc;
        for (let i = 0; i < qty; i++) {
            acc.push({
                package_id: pkgId,
                quantity: 1,
                options: {},
                fields: {}
            });
        }
        return acc;
    }, []);

    if (cartData.length === 0) {
        return {
            success: false,
            error: 'Nenhum produto configurado com package_id. Por favor, selecione Netflix.'
        };
    }

    // Format phone: remove non-digits and add +55 prefix
    let phone = customer.whatsapp.replace(/\D/g, '');
    if (!phone.startsWith('55')) {
        phone = '+55' + phone;
    } else {
        phone = '+' + phone;
    }

    const requestBody = {
        gateway: 'PIX',
        client_name: customer.name,
        client_email: customer.email,
        client_phone: phone,
        terms: true,
        cart: cartData
    };

    console.log('Centralcart Request:', requestBody);

    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await fetch(CENTRALCART_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CENTRALCART_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Centralcart Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Centralcart Error Data:', errorData);
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Centralcart Response Data:', data);

        // Check if API returns a checkout URL (redirect flow)
        if (data.checkout_url) {
            return {
                success: true,
                checkoutUrl: data.checkout_url,
                paymentId: data.id || data.order_id
            };
        }

        // Try multiple possible field names for PIX code
        const pixCode = data.pix_code || data.pixCode || data.copy_paste || data.qr_code_text || data.brcode || data.emv || data.pix?.code;
        const qrCode = data.qr_code || data.qrCode || data.qr_code_base64 || data.pix?.qr_code;

        return {
            success: true,
            qrCode: qrCode,
            pixCode: pixCode,
            paymentId: data.id || data.payment_id || data.order_id,
            expiresAt: data.expires_at
        };
    } catch (error) {
        clearTimeout(timeoutId);

        console.error('Centralcart API Error:', error);

        let errorMessage = error.message;
        if (error.name === 'AbortError') {
            errorMessage = 'Timeout - API não respondeu em 10 segundos';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erro de conexão - verifique se a API permite requisições do navegador (CORS)';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

async function openPaymentModal() {
    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal;

    paymentAmount.textContent = formatCurrency(total);

    // Show loading state
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const pixKeyInput = document.getElementById('pixKey');
    const paymentError = document.getElementById('paymentError');

    if (qrCodeContainer) {
        qrCodeContainer.innerHTML = '<div class="loading-spinner"></div><p>Gerando QR Code...</p>';
    }
    if (pixKeyInput) {
        pixKeyInput.value = 'Gerando código PIX...';
    }
    if (paymentError) {
        paymentError.style.display = 'none';
    }

    openModal(paymentModal);

    // Call Centralcart API
    const result = await createPixPayment(total, cart, userData);

    if (result.success) {
        currentPayment = result;

        // Check if we got a checkout URL (redirect to Centralcart page)
        if (result.checkoutUrl) {
            closeModal(paymentModal);
            window.open(result.checkoutUrl, '_blank');
            showNotification('Redirecionando para página de pagamento...');
            return;
        }

        // Display QR Code
        if (qrCodeContainer && result.qrCode) {
            qrCodeContainer.innerHTML = `<img src="data:image/png;base64,${result.qrCode}" alt="QR Code PIX" class="pix-qr-image">`;
        } else if (qrCodeContainer && result.pixCode) {
            // Fallback: generate QR from pix code using API
            qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(result.pixCode)}" alt="QR Code PIX" class="pix-qr-image">`;
        } else if (qrCodeContainer) {
            qrCodeContainer.innerHTML = '<p>QR Code não disponível</p>';
        }

        // Display PIX copy-paste code
        if (pixKeyInput && result.pixCode) {
            pixKeyInput.value = result.pixCode;
        } else if (pixKeyInput) {
            pixKeyInput.value = 'Código PIX não disponível';
        }

        // Start timer
        startPaymentTimer();
    } else {
        // Show error
        if (paymentError) {
            paymentError.textContent = `Erro: ${result.error}`;
            paymentError.style.display = 'block';
        }
        if (qrCodeContainer) {
            qrCodeContainer.innerHTML = '<p class="error-text">❌ Falha ao gerar QR Code</p>';
        }
        if (pixKeyInput) {
            pixKeyInput.value = 'Erro ao gerar código';
        }
        showNotification('Erro ao gerar pagamento PIX. Tente novamente.', 'error');
    }
}

let timerInterval;

function startPaymentTimer() {
    let minutes = 15;
    let seconds = 0;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                paymentTimer.textContent = 'Expirado';
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        paymentTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

copyPixKey.addEventListener('click', async () => {
    const pixKey = document.getElementById('pixKey');
    const pixCode = pixKey.value;

    try {
        // Use modern Clipboard API
        await navigator.clipboard.writeText(pixCode);

        copyPixKey.querySelector('span').textContent = '✅ Copiado!';
        setTimeout(() => {
            copyPixKey.querySelector('span').textContent = '📋 Copiar Código';
        }, 2000);

        showNotification('Código PIX copiado! Cole no seu app de banco.');
    } catch (err) {
        // Fallback for older browsers
        pixKey.select();
        document.execCommand('copy');

        copyPixKey.querySelector('span').textContent = '✅ Copiado!';
        setTimeout(() => {
            copyPixKey.querySelector('span').textContent = '📋 Copiar Código';
        }, 2000);

        showNotification('Código PIX copiado!');
    }
});

backToCart.addEventListener('click', () => {
    closeModal(paymentModal);
    if (timerInterval) clearInterval(timerInterval);
    openCart();
});

confirmPayment.addEventListener('click', () => {
    closeModal(paymentModal);
    if (timerInterval) clearInterval(timerInterval);

    // Show success modal
    successEmail.textContent = userData.email;
    successWhatsapp.textContent = userData.whatsapp;
    openModal(successModal);

    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
});

successClose.addEventListener('click', () => {
    closeModal(successModal);
});

// ========================================
// Modal Functions
// ========================================

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

registerClose.addEventListener('click', () => closeModal(registerModal));
paymentClose.addEventListener('click', () => {
    closeModal(paymentModal);
    if (timerInterval) clearInterval(timerInterval);
});

termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
});
termsClose.addEventListener('click', () => closeModal(termsModal));

privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(privacyModal);
});
privacyClose.addEventListener('click', () => closeModal(privacyModal));

refundLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(refundModal);
});
refundClose.addEventListener('click', () => closeModal(refundModal));

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            if (timerInterval) clearInterval(timerInterval);
        }
    });
});

// ========================================
// Mobile Menu
// ========================================

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ========================================
// FAQ Accordion
// ========================================

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');

        // Close all items
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========================================
// Notifications
// ========================================

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-md);
                padding: var(--space-md) var(--space-lg);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                z-index: 3000;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                box-shadow: var(--shadow-lg);
            }
            .notification-success {
                border-color: var(--success);
            }
            .notification-error {
                border-color: var(--danger);
            }
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
            }
            .notification-success .notification-icon {
                background: var(--success);
                color: white;
            }
            .notification-error .notification-icon {
                background: var(--danger);
                color: white;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// ========================================
// Local Storage
// ========================================

function saveCart() {
    localStorage.setItem('orion_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('orion_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function saveUserData() {
    localStorage.setItem('orion_user', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('orion_user');
    if (saved) {
        userData = JSON.parse(saved);
        if (userData) {
            document.getElementById('userName').value = userData.name || '';
            document.getElementById('userEmail').value = userData.email || '';
            document.getElementById('userWhatsapp').value = userData.whatsapp || '';
        }
    }
}

// ========================================
// WhatsApp Phone Mask
// ========================================

document.getElementById('userWhatsapp').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }

    e.target.value = value;
});

// ========================================
// Smooth Scroll
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadUserData();
    updatePlanPrices();
    const satisfiedEl = document.getElementById('satisfiedCount');
    if (satisfiedEl) {
        let value = parseInt((satisfiedEl.textContent || '0').replace(/\D/g, ''), 10) || 634;
        satisfiedEl.textContent = String(value);
        setInterval(() => {
            value += 1;
            satisfiedEl.textContent = String(value);
        }, 180000);
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.plan-card, .benefit-card, .step-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
