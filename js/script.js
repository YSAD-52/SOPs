document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------
    // 1. Lógica del Buscador de SOPs
    // ----------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    const sopItems = document.querySelectorAll('.sop-item');
    const noResultsMessage = document.getElementById('noResults');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            let resultsFound = false;

            sopItems.forEach(item => {
                // Obtener el texto de búsqueda de la tarjeta (data-search-term)
                const itemSearchTerm = item.getAttribute('data-search-term').toLowerCase();

                if (itemSearchTerm.includes(searchTerm)) {
                    // Mostrar la tarjeta si coincide
                    item.style.display = 'block';
                    resultsFound = true;
                } else {
                    // Ocultar la tarjeta si no coincide
                    item.style.display = 'none';
                }
            });

            // Mostrar u ocultar el mensaje de "No Resultados"
            if (noResultsMessage) {
                if (resultsFound) {
                    noResultsMessage.style.display = 'none';
                } else {
                    noResultsMessage.style.display = 'block';
                }
            }
        });
    }

    // ----------------------------------------------------
    // 2. Lógica del Sidebar Desplegable (Toggle)
    // ----------------------------------------------------
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileBreakpoint = 768; // El mismo breakpoint que usa Bootstrap (md)

    if (sidebar && sidebarToggle) {
        
        // Función principal para mostrar/ocultar el menú
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir que el clic se propague al documento
            sidebar.classList.toggle('sidebar-active');
        });

        // Lógica para cerrar el menú al hacer clic fuera (Solo en Móvil)
        document.addEventListener('click', function(event) {
            
            // 1. Verificar si el menú está visible y si estamos en vista móvil
            if (sidebar.classList.contains('sidebar-active') && window.innerWidth < mobileBreakpoint) {
                
                // 2. Verificar que el clic no haya sido dentro del menú ni en el botón de toggle
                if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                    sidebar.classList.remove('sidebar-active');
                }
            }
        });

        // Lógica para asegurar el comportamiento inicial correcto al cargar/redimensionar
        window.addEventListener('resize', function() {
            // Si la ventana pasa a escritorio, asegurar que la clase sidebar-active se remueva 
            // para que el CSS de @media se encargue de mostrarlo fijo.
            if (window.innerWidth >= mobileBreakpoint) {
                sidebar.classList.remove('sidebar-active');
            }
            // En móvil, forzar que esté colapsado inicialmente
            if (window.innerWidth < mobileBreakpoint) {
                sidebar.classList.remove('sidebar-active');
            }
        });

        // Asegurar el estado inicial en móvil
        if (window.innerWidth < mobileBreakpoint) {
            sidebar.classList.remove('sidebar-active');
        }
    }
});