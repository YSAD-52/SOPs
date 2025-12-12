document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sopUploadForm');
    const statusMessage = document.getElementById('statusMessage');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            statusMessage.style.display = 'block';
            statusMessage.className = 'mt-3 text-center text-info';
            statusMessage.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Subiendo archivo y procesando... Por favor, espere.';
            
            // Lógica de envío y comunicación con la API irá aquí
            // Usaremos new FormData(form) para capturar los datos
            
            // Simulación de respuesta (Borrar en la siguiente etapa)
            setTimeout(() => {
                // Simulación de éxito
                statusMessage.className = 'mt-3 text-center text-success';
                statusMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> SOP publicado con éxito!';
                form.reset();
                
                // Después de un tiempo, redirigir al portal principal
                // setTimeout(() => {
                //     window.location.href = 'index.html';
                // }, 2000);

            }, 3000);
            
        });
    }
});