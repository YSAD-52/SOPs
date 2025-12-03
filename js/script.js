document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const sopItems = document.querySelectorAll('.sop-item');

    // Escucha el evento de tecleo
    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        sopItems.forEach(item => {
            // Usa el atributo data-search-term para una búsqueda limpia
            const itemSearchData = item.getAttribute('data-search-term').toLowerCase();

            // Muestra u oculta la tarjeta
            if (itemSearchData.includes(searchTerm)) {
                item.style.display = 'block'; 
            } else {
                item.style.display = 'none';
            }
        });
    });
});