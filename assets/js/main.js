// Función para cargar componentes HTML (Header y Footer)
async function loadComponents() {
    try {
        // Cargar Header
        const headerResponse = await fetch('assets/components/header.html');
        const headerData = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerData;

        // Cargar Footer
        const footerResponse = await fetch('assets/components/footer.html');
        const footerData = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;

        // 1. Una vez cargado el HTML, inicializamos la lógica del menú móvil
        initMobileMenu();

        // 2. Inicializamos AOS Animations DESPUÉS de inyectar el Header y Footer
        AOS.init({
            once: true,
            offset: 100,
            duration: 800,
            easing: 'ease-out-cubic',
        });

    } catch (error) {
        console.error("Error cargando los componentes:", error);
    }
}

// Lógica del menú móvil (encapsulada en una función)
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

        // Smooth Scroll para los enlaces del menú móvil
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Solo prevenir default si es un hash de la misma página
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

// Iniciar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Llamar a la función que carga el Header y Footer (AOS ahora arranca por dentro)
    loadComponents();
});

/* =========================================
   6. SEGURIDAD Y PREVENCIÓN
   ========================================= */

// Deshabilitar menú contextual
document.addEventListener('contextmenu', event => event.preventDefault());

// Bloquear atajos de teclado de herramientas de desarrollador
document.onkeydown = function(e) {
    if(e.keyCode == 123 || 
      (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || 
      (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
}