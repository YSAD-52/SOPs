// La función recibe la solicitud del formulario
module.exports = async (req, res) => {
    // 1. Verificar que el método sea POST y que haya un archivo adjunto
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 2. RECIBIR el archivo PDF
    const pdfFile = req.files.pdf; 

    // 3. PROCESAR Y CONVERTIR (Librerías de PDF aquí)
    //    * La librería toma el PDF, lo renderiza a páginas JPG/PNG.

    // 4. SUBIR A BLOB (Usando el BLOB_READ_WRITE_TOKEN)
    //    * Por cada página generada (ej. page-01.jpg, page-02.jpg),
    //      el código sube esa imagen a tu Vercel Blob Store.

    // 5. RESPONDER
    //    * Devolver al frontend una lista de las URLs públicas de las imágenes.

    return res.status(200).json({ 
        message: 'Conversion exitosa', 
        pages: ['url-pagina-1.jpg', 'url-pagina-2.jpg']
    });
};