/* ===== BASE DE DATOS DE PRODUCTOS ===== */
const productos = [
  {
    id: 1,
    nombre: 'Espresso',
    descripcion: 'Intenso y aromático, nuestro espresso 100% arábica.',
    descripcionLarga: 'Extraído de granos arábica recién molidos, nuestro espresso tiene cuerpo completo, notas a chocolate amargo y una crema dorada impecable. Servido en taza de 30ml.',
    precio: 2500,
    imagen: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80',
  },
  {
    id: 2,
    nombre: 'Capuccino',
    descripcion: 'Espresso con leche vaporizada y una capa suave de espuma.',
    descripcionLarga: 'Nuestro capuccino equilibra la intensidad del espresso con leche vaporizada cremosa y una generosa capa de espuma sedosa. Un clásico irresistible.',
    precio: 3200,
    imagen: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80',
  },
  {
    id: 3,
    nombre: 'Croissant',
    descripcion: 'Hojaldrado y dorado, recién horneado cada mañana.',
    descripcionLarga: 'Masa de hojaldre con mantequilla de origen francés, fermentada lentamente y horneada hasta lograr su textura crujiente por fuera y suave por dentro.',
    precio: 2800,
    imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038028a?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1555507036-ab1f4038028a?w=800&q=80',
  },
  {
    id: 4,
    nombre: 'Muffin Arándano',
    descripcion: 'Esponjoso muffin con arándanos frescos y streusel.',
    descripcionLarga: 'Muffin artesanal relleno de arándanos frescos, con un crumble de streusel en la parte superior que le da un toque crujiente. Esponjoso y dulce en su punto justo.',
    precio: 2200,
    imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
  },
  {
    id: 5,
    nombre: 'Latte',
    descripcion: 'Suave mezcla de espresso y leche cremosa.',
    descripcionLarga: 'Doble shot de espresso con leche vaporizada a la perfección, logrando una textura aterciopelada. Ideal para quienes buscan un café suave y reconfortante.',
    precio: 3000,
    imagen: 'https://images.unsplash.com/photo-1541167760496-13c2fb3e4b1b?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1541167760496-13c2fb3e4b1b?w=800&q=80',
  },
  {
    id: 6,
    nombre: 'Té Chai',
    descripcion: 'Especias aromáticas con leche y un toque de miel.',
    descripcionLarga: 'Mezcla casera de té negro, canela, cardamomo, jengibre y clavo de olor, endulzado con miel orgánica y coronado con leche espumosa.',
    precio: 2900,
    imagen: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c7?w=400&q=80',
    imagenGrande: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c7?w=800&q=80',
  },
];

/* ===== ESTADO DEL CARRITO ===== */
let carrito = [];

/* ===== REFERENCIAS AL DOM ===== */
const cartSidebar = document.getElementById('cartSidebar');
const cartList = document.getElementById('cartList');
const cartEmptyMsg = document.getElementById('cartEmptyMsg');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const overlay = document.getElementById('overlay');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');

/* ===== FUNCIONES DEL CARRITO ===== */

function actualizarCarrito() {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (cartCount) cartCount.textContent = totalItems;

  const vacio = carrito.length === 0;
  if (cartEmptyMsg) cartEmptyMsg.style.display = vacio ? 'block' : 'none';
  if (cartList) cartList.style.display = vacio ? 'none' : 'block';

  if (vacio) {
    if (cartList) cartList.innerHTML = '';
    if (cartTotal) cartTotal.textContent = '$0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  const itemsHtml = carrito.map((item) => {
    const prod = productos.find((p) => p.id === item.id);
    const subtotal = prod.precio * item.cantidad;
    return `
      <li class="cart-item" data-id="${item.id}">
        <img class="cart-item__image" src="${prod.imagen}" alt="${prod.nombre}" />
        <div class="cart-item__info">
          <div class="cart-item__name">${prod.nombre}</div>
          <div class="cart-item__price">$${subtotal.toLocaleString()}</div>
        </div>
        <div class="cart-item__qty">
          <button class="cart-item__qty-btn" data-action="decrement" data-id="${item.id}">−</button>
          <span class="cart-item__qty-value">${item.cantidad}</span>
          <button class="cart-item__qty-btn" data-action="increment" data-id="${item.id}">+</button>
        </div>
        <button class="cart-item__remove" data-action="remove" data-id="${item.id}" aria-label="Eliminar producto">&times;</button>
      </li>
    `;
  }).join('');
  if (cartList) cartList.innerHTML = itemsHtml;

  const total = carrito.reduce((sum, item) => {
    const prod = productos.find((p) => p.id === item.id);
    return sum + prod.precio * item.cantidad;
  }, 0);
  if (cartTotal) cartTotal.textContent = `$${total.toLocaleString()}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function agregarAlCarrito(productId) {
  const existente = carrito.find((item) => item.id === productId);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id: productId, cantidad: 1 });
  }
  actualizarCarrito();
}

function eliminarDelCarrito(productId) {
  carrito = carrito.filter((item) => item.id !== productId);
  actualizarCarrito();
}

function cambiarCantidad(productId, delta) {
  const item = carrito.find((i) => i.id === productId);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    eliminarDelCarrito(productId);
  } else {
    actualizarCarrito();
  }
}

/* ===== ABRIR / CERRAR CARRITO ===== */
function abrirCarrito() {
  if (cartSidebar) cartSidebar.classList.add('cart--open');
  if (overlay) overlay.classList.add('overlay--visible');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  if (cartSidebar) cartSidebar.classList.remove('cart--open');
  if (overlay) overlay.classList.remove('overlay--visible');
  document.body.style.overflow = '';
}

/* ===== MODAL DE PRODUCTO (imagen interactiva) ===== */
const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalInner = document.getElementById('modalInner');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function abrirModal(productId) {
  if (!modal) return;
  const prod = productos.find((p) => p.id === productId);
  if (!prod) return;

  modalInner.innerHTML = `
    <img
      class="modal__image"
      src="${prod.imagenGrande}"
      alt="${prod.nombre}"
    />
    <div class="modal__body">
      <h2 class="modal__name">${prod.nombre}</h2>
      <p class="modal__desc">${prod.descripcionLarga}</p>
      <span class="modal__price">$${prod.precio.toLocaleString()}</span>
      <button class="modal__btn" data-id="${prod.id}">Añadir al carrito</button>
    </div>
  `;

  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('modal--open');
  document.body.style.overflow = '';
}

/* ===== EVENTOS ===== */

/* --- Productos (solo en menu.html) --- */
const productGrid = document.getElementById('productGrid');
if (productGrid) {
  /* Renderizar productos */
  const html = productos.map((p) => `
    <article class="product-card">
      <img
        class="product-card__image"
        src="${p.imagen}"
        alt="${p.nombre}"
        loading="lazy"
        data-id="${p.id}"
      />
      <div class="product-card__body">
        <h3 class="product-card__name">${p.nombre}</h3>
        <p class="product-card__desc">${p.descripcion}</p>
        <div class="product-card__footer">
          <span class="product-card__price">$${p.precio.toLocaleString()}</span>
          <button class="product-card__btn" data-id="${p.id}">
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  `).join('');
  productGrid.innerHTML = html;

  /* Delegación: clic en imagen → modal */
  productGrid.addEventListener('click', (e) => {
    const img = e.target.closest('.product-card__image');
    if (img) {
      abrirModal(Number(img.dataset.id));
      return;
    }

    /* Clic en botón "Añadir al carrito" */
    const btn = e.target.closest('.product-card__btn');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    agregarAlCarrito(id);

    const originalText = btn.textContent;
    btn.textContent = '✓ Añadido';
    btn.style.background = 'var(--color-success)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 800);
  });
}

/* --- Modal --- */
if (modalOverlay) modalOverlay.addEventListener('click', cerrarModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', cerrarModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('modal--open')) cerrarModal();
    if (cartSidebar && cartSidebar.classList.contains('cart--open')) cerrarCarrito();
  }
});

/* Botón dentro del modal ("Añadir al carrito") */
if (modalInner) {
  modalInner.addEventListener('click', (e) => {
    const btn = e.target.closest('.modal__btn');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    agregarAlCarrito(id);
    cerrarModal();

    /* Feedback: abrir carrito brevemente para mostrar la confirmación */
    abrirCarrito();
  });
}

/* --- Carrito --- */
if (cartList) {
  cartList.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    const id = Number(target.dataset.id);
    const action = target.dataset.action;

    if (action === 'increment') cambiarCantidad(id, 1);
    else if (action === 'decrement') cambiarCantidad(id, -1);
    else if (action === 'remove') eliminarDelCarrito(id);
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const total = carrito.reduce((sum, item) => {
      const prod = productos.find((p) => p.id === item.id);
      return sum + prod.precio * item.cantidad;
    }, 0);
    alert(`✅ Pago simulado exitosamente.\nTotal: $${total.toLocaleString()}\nGracias por tu compra en CafeAroma.`);
    carrito = [];
    actualizarCarrito();
    cerrarCarrito();
  });
}

if (cartToggleBtn) cartToggleBtn.addEventListener('click', abrirCarrito);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', cerrarCarrito);
if (overlay) overlay.addEventListener('click', cerrarCarrito);

/* ===== FORMULARIO DE CONTACTO (solo en contact.html) ===== */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const successCloseBtn = document.getElementById('successCloseBtn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Ingresa un correo electrónico válido.');
      return;
    }

    /* Mostrar modal de éxito */
    if (contactSuccess) contactSuccess.classList.add('contact-success--open');

    contactForm.reset();
  });
}

if (successCloseBtn) {
  successCloseBtn.addEventListener('click', () => {
    if (contactSuccess) contactSuccess.classList.remove('contact-success--open');
  });
}

if (contactSuccess) {
  contactSuccess.addEventListener('click', (e) => {
    if (e.target === contactSuccess) {
      contactSuccess.classList.remove('contact-success--open');
    }
  });
}

/* ===== INICIALIZACIÓN ===== */
actualizarCarrito();
