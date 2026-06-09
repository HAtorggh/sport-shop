const products = [
    { id: 1, name: "Беговые кроссовки AirFlow", desc: "Дышащая сетка, амортизация, подошва для трейла.", price: 2890, priceStr: "2 890 ₽", img: "img/shoes.jpg" },
    { id: 2, name: "Умная фитнес-капсула", desc: "Трекер активности, пульсометр, водонепроницаемый дизайн.", price: 1290, priceStr: "1 290 ₽", img: "img/watch.jpg" },
    { id: 3, name: "Йога-коврик ProGrip", desc: "Экологичный, нескользящий, толщина 6 мм.", price: 1150, priceStr: "1 150 ₽", img: "img/mat.jpg" },
    { id: 4, name: "Гантели неопреновые 2x5кг", desc: "Удобный хват, компактный набор для дома.", price: 1890, priceStr: "1 890 ₽", img: "img/dumbbells.jpg" },
    { id: 5, name: "Спортивная бутылка 1L", desc: "Термоизоляция, нержавейка, удобная крышка.", price: 590, priceStr: "590 ₽", img: "img/bottle.jpg" },
    { id: 6, name: "Эспандер кистевой", desc: "Регулируемая нагрузка, для силы хвата.", price: 320, priceStr: "320 ₽", img: "img/expander.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = totalCount;
}

function updateCartModal() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        if (cartTotalPrice) cartTotalPrice.textContent = '0 ₽';
        return;
    }

    let total = 0;
    cartItemsList.innerHTML = '';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItemsList.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.priceStr} / шт</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-plus" data-index="${index}">+</button>
                </div>
                <div class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        `;
    });
    if (cartTotalPrice) cartTotalPrice.textContent = `${total.toLocaleString()} ₽`;

    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            if (cart[idx].quantity > 1) cart[idx].quantity--;
            else cart.splice(idx, 1);
            saveCart();
        };
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantity++;
            saveCart();
        };
    });
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            cart.splice(parseInt(btn.dataset.index), 1);
            saveCart();
        };
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.quantity++;
    else cart.push({ id: product.id, name: product.name, price: product.price, priceStr: product.priceStr, quantity: 1 });
    saveCart();
    showNotification(`✅ ${product.name} добавлен в корзину!`);
}

function showNotification(text) {
    let toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1e6f5c;color:white;padding:12px 28px;border-radius:50px;font-weight:600;z-index:9999;box-shadow:0 5px 15px rgba(0,0,0,0.2);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-desc">${product.desc}</div>
                    <div class="product-price">
                        <span class="price">${product.priceStr}</span>
                        <div class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => addToCart(parseInt(btn.dataset.id));
    });
}

function initCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartIcon) cartIcon.onclick = () => { updateCartModal(); cartModal.classList.add('show'); };
    if (cartClose) cartClose.onclick = () => cartModal.classList.remove('show');
    if (checkoutBtn) checkoutBtn.onclick = () => {
        if (cart.length === 0) { showNotification('Корзина пуста!'); return; }
        cartModal.classList.remove('show');
        showNotification('🎉 Спасибо за заказ! Мы свяжемся с вами.');
        cart = [];
        saveCart();
    };
    window.onclick = (e) => { if (e.target === cartModal) cartModal.classList.remove('show'); };
}

function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('fbName')?.value.trim();
        const email = document.getElementById('fbEmail')?.value.trim();
        const message = document.getElementById('fbMessage')?.value.trim();
        const msgDiv = document.getElementById('feedbackMessage');
        
        if (!name || !email || !message) { showNotification('⚠️ Заполните все поля!'); return; }
        if (!email.includes('@')) { showNotification('📧 Введите корректный email'); return; }
        
        if (msgDiv) {
            msgDiv.style.display = 'block';
            msgDiv.innerHTML = `<i class="fas fa-check-circle"></i> Спасибо, ${name}! Мы свяжемся с вами.`;
            setTimeout(() => msgDiv.style.display = 'none', 4000);
        }
        
        document.getElementById('fbName').value = '';
        document.getElementById('fbEmail').value = '';
        document.getElementById('fbMessage').value = '';
        showNotification('✉️ Сообщение отправлено!');
    };
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initCartModal();
    initFeedbackForm();
    updateCartCount();
    updateCartModal();
});