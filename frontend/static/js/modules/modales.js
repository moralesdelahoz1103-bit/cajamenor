/* ========================================
   GESTIÓN DE MODALES
   ========================================
   Archivo: modales.js
   Propósito: Funciones para abrir/cerrar modales
   y gestionar overlays
   ======================================== */

/**
 * Abre un modal por su ID
 * @param {string} modalId - ID del modal a abrir
 */
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cierra un modal por su ID
 * @param {string} modalId - ID del modal a cerrar
 */
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Cierra todos los modales abiertos
 */
function cerrarTodosLosModales() {
    const modales = document.querySelectorAll('.modal-overlay.active');
    modales.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

/**
 * Inicializa los event listeners para cerrar modales al hacer clic fuera
 */
function inicializarEventosModales() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });
}
