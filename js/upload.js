document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sopUploadForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitButton = document.getElementById('submitButton');

    // --- PRUEBA DE DIAGNÓSTICO ---
    console.log("1. Formulario encontrado:", form !== null); 
    // ----------------------------
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // --- PRUEBA DE DIAGNÓSTICO ---
            console.log("2. Evento SUBMIT interceptado. Iniciando fetch..."); 
            // ----------------------------

            // 1. Mostrar estado de carga y deshabilitar el botón
            submitButton.disabled = true;
            statusMessage.style.display = 'block';
            statusMessage.className = 'mt-3 text-center text-info';
            statusMessage.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Subiendo archivo y procesando... Por favor, espere.';
            
            // 2. Crear objeto FormData para enviar archivos y texto juntos
            const formData = new FormData(form);

            try {
                // 3. Enviar la petición a la API de Vercel
                const response = await fetch('/api/upload-sop', {
                    method: 'POST',
                    body: formData 
                });

                const result = await response.json();

                // 4. Manejar la respuesta del servidor
                if (response.ok) {
                    // Éxito (código 200 de la API)
                    statusMessage.className = 'mt-3 text-center text-success';
                    statusMessage.innerHTML = `<i class="fas fa-check-circle me-2"></i> SOP publicado con éxito. ID: ${result.sop_id} (Redirigiendo...)`;
                    form.reset();
                    
                    // Redirigir al portal principal después de 3 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                    
                } else {
                    // Error (código 400 o 500 de la API)
                    // Muestra el mensaje de error que venga del backend
                    throw new Error(result.message || 'Error desconocido al procesar el SOP.');
                }
                
            } catch (error) {
                // 5. Manejar errores de red o errores lanzados por la API
                console.error('Error en la subida:', error);
                statusMessage.className = 'mt-3 text-center text-danger';
                statusMessage.innerHTML = `<i class="fas fa-times-circle me-2"></i> Error: ${error.message}`;
                
            } finally {
                // 6. Volver a habilitar el botón si no se redirige
                if (submitButton) {
                   submitButton.disabled = false;
                }
            }
        });
    }
});