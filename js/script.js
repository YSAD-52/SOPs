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
});