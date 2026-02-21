/* =========================================================================
   NOVA CARE - MAIN JAVASCRIPT
   Desarrollado por Nova Studio Web
   ========================================================================= */

// 1. FUNCIÓN PRINCIPAL: Cargar Header y Footer dinámicamente
async function loadComponents() {
    try {
        // Cargar Header
        const headerResponse = await fetch('assets/components/header.html');
        if (headerResponse.ok) {
            const headerData = await headerResponse.text();
            document.getElementById('header-placeholder').innerHTML = headerData;
        }

        // Cargar Footer
        const footerResponse = await fetch('assets/components/footer.html');
        if (footerResponse.ok) {
            const footerData = await footerResponse.text();
            document.getElementById('footer-placeholder').innerHTML = footerData;
        }

        // --- INICIALIZAR TODAS LAS FUNCIONES DESPUÉS DE CARGAR EL HTML ---
        
        // Menú móvil (Header)
        initMobileMenu();
        
        // Carrusel (Páginas: Inicio, Sobre Nosotros, Servicios)
        initCarousel();
        
        // Filtros del Blog (Página: Blog)
        initBlogFilters();

        // Acordeón de FAQ (Página: Preguntas Frecuentes)
        initFaqAccordion();

        // Animaciones de Scroll
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: true,
                offset: 100,
                duration: 800,
                easing: 'ease-out-cubic',
            });
        }

    } catch (error) {
        console.error("Error cargando los componentes:", error);
    }
}

/* =========================================
   2. LÓGICA DEL MENÚ MÓVIL
   ========================================= */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
            const icon = btn.querySelector('i');
            if (menu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Smooth Scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if(this.getAttribute('href').startsWith('#') && this.getAttribute('href').length > 1) {
                    e.preventDefault();
                    menu.classList.remove('open');
                    const icon = btn.querySelector('i');
                    if(icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    const target = document.querySelector(this.getAttribute('href'));
                    if(target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
}

/* =========================================
   3. LÓGICA DEL CARRUSEL (DRAG & ARROWS)
   ========================================= */
function initCarousel() {
    const carousel = document.getElementById('services-carousel');
    const slideLeft = document.getElementById('slideLeft');
    const slideRight = document.getElementById('slideRight');

    if (carousel) {
        // Flechas
        if (slideLeft) {
            slideLeft.addEventListener('click', () => {
                carousel.scrollBy({ left: -382, behavior: 'smooth' });
            });
        }
        if (slideRight) {
            slideRight.addEventListener('click', () => {
                carousel.scrollBy({ left: 382, behavior: 'smooth' });
            });
        }

        // Arrastrar con mouse
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active'); // CSS cursor: grabbing
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5; // Velocidad de arrastre
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
}

/* =========================================
   4. LÓGICA DE FILTROS DEL BLOG (CORREGIDA)
   ========================================= */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.blog-article');

    if (filterBtns.length > 0 && articles.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                
                // 1. Quitar estado activo a TODOS los botones
                filterBtns.forEach(b => {
                    b.className = 'filter-btn px-5 py-2 rounded-full bg-white text-gray-600 font-medium text-sm border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all focus:outline-none cursor-pointer';
                });
                
                // 2. Poner estado activo SOLO al botón seleccionado
                btn.className = 'filter-btn px-5 py-2 rounded-full bg-blue-600 text-white font-medium text-sm border border-transparent shadow-md hover:shadow-lg transition-all focus:outline-none cursor-pointer';

                // 3. Filtrar artículos
                const filterValue = btn.getAttribute('data-filter');
                
                articles.forEach(article => {
                    if (filterValue === 'todos' || article.getAttribute('data-category') === filterValue) {
                        article.classList.remove('hidden');
                        // Forzar a que el elemento sea visible tras la animación de AOS
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    } else {
                        article.classList.add('hidden');
                    }
                });

                // 4. Refrescar AOS para que recalcule las posiciones de la página
                if (typeof AOS !== 'undefined') {
                    setTimeout(() => AOS.refresh(), 100);
                }
            });
        });
    }
}

/* =========================================
   5. LÓGICA ACORDEÓN PREGUNTAS FRECUENTES
   ========================================= */
function initFaqAccordion() {
    const details = document.querySelectorAll("details");
    if (details.length > 0) {
        details.forEach((targetDetail) => {
            targetDetail.addEventListener("click", () => {
                details.forEach((detail) => {
                    if (detail !== targetDetail) {
                        detail.removeAttribute("open");
                    }
                });
            });
        });
    }
}

/* =========================================
   6. INICIALIZADOR GLOBAL
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar el HTML y lanzar todas las funciones anteriores
    loadComponents();

    // 2. Establecer el año dinámico en el footer (si existe)
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

/* =========================================
   7. SEGURIDAD BÁSICA (Desactivada en Desarrollo)
   ========================================= */

document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
}
