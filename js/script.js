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
    // 2. Lógica del Sidebar Desplegable (Toggle) - Universal
    // ----------------------------------------------------
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (sidebar && sidebarToggle) {
        
        // Función principal para mostrar/ocultar el menú
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el clic se propague y cierre inmediatamente
            sidebar.classList.toggle('sidebar-active'); // Toggle en cualquier tamaño de pantalla
        });

        // Lógica para cerrar el menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            
            // Si el menú está visible...
            if (sidebar.classList.contains('sidebar-active')) {
                
                // ... y si el clic no fue dentro del menú ni en el botón de toggle, ocultar el menú.
                if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                    sidebar.classList.remove('sidebar-active');
                }
            }
        });

        // Estado inicial: Asegurar que esté colapsado al cargar
        sidebar.classList.remove('sidebar-active');
    }
});