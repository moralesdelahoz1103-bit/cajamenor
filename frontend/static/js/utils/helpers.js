/* ========================================
   UTILIDADES GENERALES
   ========================================
   Archivo: helpers.js
   Propósito: Funciones auxiliares reutilizables
   ======================================== */

/**
 * Formatea un número como moneda en formato colombiano
 * @param {number|string} monto - El monto a formatear
 * @returns {string} - Monto formateado (ej: "1.234.567,89")
 */
function formatearMonto(monto) {
    return parseFloat(monto).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

/**
 * Genera un ID único para nuevas solicitudes en formato CM-año-4dígitos
 * @returns {string} - ID único con formato CM-2025-XXXX
 */
function generarId() {
    const año = new Date().getFullYear();
    const aleatorio = Math.floor(1000 + Math.random() * 9000); // Genera número entre 1000 y 9999
    return `CM-${año}-${aleatorio}`;
}

/**
 * Genera un número de solicitud único (alias de generarId para compatibilidad)
 * @returns {string} - Número de solicitud
 */
function generarNumeroSolicitud() {
    return generarId();
}

/**
 * Obtiene la fecha actual en formato dd/mm/yyyy
 * @returns {string} - Fecha formateada
 */
function obtenerFechaActual() {
    return new Date().toLocaleDateString('es-ES');
}

/**
 * Obtiene la fecha y hora actual en formato legible
 * @returns {string} - Fecha y hora formateada (dd/mm/yyyy HH:MM)
 */
function obtenerFechaHoraActual() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES');
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { fecha, hora, timestamp: ahora.getTime() };
}

/**
 * Obtiene la clase CSS correspondiente a un estado
 * @param {string} estado - El estado de la solicitud
 * @returns {string} - Clase CSS del estado
 */
function obtenerClaseEstado(estado) {
    return CLASES_ESTADO[estado] || 'pendiente';
}

/**
 * Obtiene el icono SVG correspondiente a un estado
 * @param {string} estado - El estado de la solicitud
 * @returns {string} - HTML del icono SVG
 */
function obtenerIconoEstado(estado) {
    const iconos = {
        [ESTADOS.NEGADO]: ICONOS.estado.negado,
        [ESTADOS.PENDIENTE]: ICONOS.estado.pendiente,
        [ESTADOS.SOLICITUD_GERENCIA]: ICONOS.estado.solicitudGerencia,
        [ESTADOS.EN_GERENTE]: ICONOS.estado.enGerente,
        [ESTADOS.EN_RESPONSABLE]: ICONOS.estado.enResponsable,
        [ESTADOS.DESEMBOLSADO]: ICONOS.estado.desembolsado
    };
    return iconos[estado] || iconos[ESTADOS.PENDIENTE];
}

/**
 * Valida si un campo de formulario está vacío
 * @param {string} valor - El valor a validar
 * @returns {boolean} - true si está vacío, false si tiene contenido
 */
function estaVacio(valor) {
    return !valor || valor.trim() === '';
}

/**
 * Valida si un monto es válido (número positivo)
 * @param {string|number} monto - El monto a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
function esMontoValido(monto) {
    const numero = parseFloat(monto);
    return !isNaN(numero) && numero > 0;
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} texto - El texto a escapar
 * @returns {string} - Texto con caracteres HTML escapados
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Convierte una fecha en formato dd/mm/yyyy a objeto Date
 * @param {string} fechaStr - Fecha en formato dd/mm/yyyy
 * @returns {Date} - Objeto Date
 */
function convertirFecha(fechaStr) {
    const partes = fechaStr.split('/');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

/**
 * Compara dos fechas en formato dd/mm/yyyy
 * @param {string} fecha1 - Primera fecha
 * @param {string} fecha2 - Segunda fecha
 * @returns {number} - -1 si fecha1 < fecha2, 0 si iguales, 1 si fecha1 > fecha2
 */
function compararFechas(fecha1, fecha2) {
    const d1 = convertirFecha(fecha1);
    const d2 = convertirFecha(fecha2);
    return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función con debounce
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
