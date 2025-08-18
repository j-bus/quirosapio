// Google Analytics Event Tracking para Centro Quiropráctico Quirosapio
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar que gtag esté disponible
    if (typeof gtag === 'undefined') {
        console.warn('Google Analytics (gtag) no está cargado');
        return;
    }

    // 1. Tracking de clics en números de teléfono
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const phoneNumber = this.href.replace('tel:', '');
            gtag('event', 'click_telefono', {
                'event_category': 'Contacto',
                'event_label': phoneNumber,
                'value': 1
            });
        });
    });

    // 2. Tracking de clics en emails
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const email = this.href.replace('mailto:', '');
            gtag('event', 'click_email', {
                'event_category': 'Contacto',
                'event_label': email,
                'value': 1
            });
        });
    });

    // 3. Tracking de envío de formularios (WPForms)
    if (typeof wpforms !== 'undefined') {
        // WPForms tracking
        document.addEventListener('wpformsAjaxSubmitSuccess', function(e) {
            gtag('event', 'formulario_enviado', {
                'event_category': 'Formularios',
                'event_label': 'Formulario ID: ' + e.detail.formId,
                'value': 1
            });
        });
    }

    // 4. Tracking de scroll profundo (25%, 50%, 75%, 100%)
    let scrollPercentages = {25: false, 50: false, 75: false, 100: false};
    
    function trackScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercentage = Math.round((scrolled / scrollHeight) * 100);
        
        Object.keys(scrollPercentages).forEach(function(percentage) {
            if (scrollPercentage >= percentage && !scrollPercentages[percentage]) {
                scrollPercentages[percentage] = true;
                gtag('event', 'scroll_profundidad', {
                    'event_category': 'Engagement',
                    'event_label': percentage + '%',
                    'value': percentage
                });
            }
        });
    }
    
    // Debounce para optimizar performance
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(trackScroll, 100);
    });

    // 5. Tracking de tiempo en página (cada 30 segundos)
    let timeOnPage = 0;
    setInterval(function() {
        timeOnPage += 30;
        if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 120 || timeOnPage === 180) {
            gtag('event', 'tiempo_en_pagina', {
                'event_category': 'Engagement',
                'event_label': timeOnPage + ' segundos',
                'value': timeOnPage
            });
        }
    }, 30000);

    // 6. Tracking de clics en botones importantes
    document.querySelectorAll('.elementor-button, .wp-block-button__link, button[type="submit"]').forEach(function(button) {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            gtag('event', 'click_boton', {
                'event_category': 'Interacción',
                'event_label': buttonText,
                'value': 1
            });
        });
    });

    // 7. Tracking de interacción con el mapa (si existe Google Maps)
    const mapElements = document.querySelectorAll('.elementor-widget-google_maps iframe');
    mapElements.forEach(function(map) {
        let mapInteracted = false;
        map.addEventListener('mouseover', function() {
            if (!mapInteracted) {
                mapInteracted = true;
                gtag('event', 'interaccion_mapa', {
                    'event_category': 'Engagement',
                    'event_label': 'Mapa Google',
                    'value': 1
                });
            }
        });
    });

    // 8. Tracking de clics en enlaces externos
    document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(function(link) {
        link.addEventListener('click', function() {
            gtag('event', 'click_enlace_externo', {
                'event_category': 'Enlaces',
                'event_label': this.href,
                'value': 1
            });
        });
    });

    // 9. Tracking de navegación del menú principal
    document.querySelectorAll('#site-navigation a, .sidr-class-dropdown-menu a').forEach(function(menuLink) {
        menuLink.addEventListener('click', function() {
            const menuText = this.textContent.trim();
            const menuHref = this.getAttribute('href');
            gtag('event', 'navegacion_menu', {
                'event_category': 'Navegación',
                'event_label': menuText + ' - ' + menuHref,
                'value': 1
            });
        });
    });

    // 10. Tracking de páginas específicas importantes
    const currentPage = window.location.pathname;
    const importantPages = {
        '/contacto/': 'Página de Contacto',
        '/precios/': 'Página de Precios',
        '/quienes-somos/': 'Página Quiénes Somos',
        '/testimonios/': 'Página de Testimonios'
    };
    
    if (importantPages[currentPage]) {
        gtag('event', 'vista_pagina_importante', {
            'event_category': 'Páginas Clave',
            'event_label': importantPages[currentPage],
            'value': 1
        });
    }

});