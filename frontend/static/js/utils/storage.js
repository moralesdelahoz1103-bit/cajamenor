/* ========================================
   GESTIÓN DE LOCAL STORAGE
   ========================================
   Archivo: storage.js
   Propósito: Manejo de persistencia de datos
   en localStorage
   ======================================== */

/**
 * Guarda las solicitudes en localStorage
 * @param {Array} solicitudes - Array de solicitudes a guardar
 */
function guardarEnLocalStorage(solicitudes) {
    try {
        localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(solicitudes));
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
}

/**
 * Carga las solicitudes desde localStorage
 * @returns {Array} - Array de solicitudes o array vacío si no hay datos
 */
function cargarDeLocalStorage() {
    try {
        const data = localStorage.getItem(APP_CONFIG.localStorageKey);
        if (!data) return [];
        
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error al cargar de localStorage:', error);
        // Si hay error, limpiar localStorage corrupto
        localStorage.removeItem(APP_CONFIG.localStorageKey);
        return [];
    }
}

/**
 * Elimina todas las solicitudes del localStorage
 * @returns {boolean} - true si se eliminó correctamente
 */
function limpiarLocalStorage() {
    try {
        localStorage.removeItem(APP_CONFIG.localStorageKey);
        return true;
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
        return false;
    }
}

/**
 * Exporta las solicitudes como JSON descargable
 * @param {Array} solicitudes - Array de solicitudes a exportar
 */
function exportarSolicitudes(solicitudes) {
    const dataStr = JSON.stringify(solicitudes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `caja-menor-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Importa solicitudes desde un archivo JSON
 * @param {File} archivo - Archivo JSON a importar
 * @param {Function} callback - Función a ejecutar con los datos importados
 */
function importarSolicitudes(archivo, callback) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const solicitudes = JSON.parse(e.target.result);
            if (Array.isArray(solicitudes)) {
                callback(solicitudes);
            } else {
                throw new Error('El archivo no contiene un array válido');
            }
        } catch (error) {
            console.error('Error al importar solicitudes:', error);
            alert('Error al importar el archivo. Verifica que sea un JSON válido.');
        }
    };
    
    reader.readAsText(archivo);
}
