/* ========================================
   COMPONENTE: TARJETA DE SOLICITUD
   ========================================
   Archivo: solicitud-card.js
   Propósito: Genera el HTML de las tarjetas
   de solicitud unificadas para todas las vistas
   ======================================== */

/**
 * Componente base: Genera el HTML común de la tarjeta
 * @param {Object} solicitud - Datos de la solicitud
 * @param {Object} opciones - Opciones de configuración
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaSolicitudBase(solicitud, opciones = {}) {
    const {
        mostrarBotonesAprobacion = false,
        estadosAprobables = [],
        callbackVerDetalle = 'verDetalle',
        callbackAprobar = 'aprobarSolicitudDirecta',
        callbackRechazar = 'rechazarSolicitudDirecta',
        extraBotonesHTML = ''
    } = opciones;
    
    const puedeAprobar = mostrarBotonesAprobacion && estadosAprobables.includes(solicitud.estado);
    
    return `
        <div class="solicitud-card">
            <div class="solicitud-header">
                <div class="solicitud-title-group">
                    <div class="solicitud-icon" style="background: #dbeafe; color: #2563eb; border-radius: 1rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <div class="solicitud-title-info">
                        <h3 class="solicitud-description">${solicitud.nombre}</h3>
                        <p>${solicitud.numero}</p>
                    </div>
                </div>
                <div class="badge ${obtenerClaseEstado(solicitud.estado)}">
                    ${obtenerIconoEstado(solicitud.estado)}
                    ${solicitud.estado}
                </div>
            </div>
            <div class="solicitud-details">
                <div class="detail-item">
                    <div class="detail-icon" style="background: #fef3c7; color: #d97706; border-radius: 1rem;">
                        ${ICONOS.detalle.calendario}
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Fecha</div>
                        <div class="detail-value">${solicitud.fecha}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon" style="background: #d1fae5; color: #059669; border-radius: 1rem;">
                        ${ICONOS.detalle.usuario}
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Solicitante</div>
                        <div class="detail-value">${solicitud.solicitante}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon" style="background: #fee2e2; color: #dc2626; border-radius: 1rem;">
                        ${ICONOS.detalle.dinero}
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Monto</div>
                        <div class="detail-value">$ ${formatearMonto(solicitud.monto)}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon" style="background: #dbeafe; color: #2563eb; border-radius: 1rem;">
                        ${ICONOS.detalle.edificio}
                    </div>
                    <div class="detail-content">
                        <div class="detail-label">Centro de Costo</div>
                        <div class="detail-value">${solicitud.centroCosto}</div>
                    </div>
                </div>
            </div>
            <div class="progress-section">
                <div class="progress-label">Progreso de la solicitud</div>
                <div class="progress-tracker">
                    ${crearProgressTracker(solicitud.estado, solicitud.historial)}
                </div>
            </div>
            <div class="solicitud-footer" style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="${callbackVerDetalle}('${solicitud.id}')">
                    ${ICONOS.accion.verDetalle}
                    Ver detalle
                </button>
                ${puedeAprobar ? `
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="btn btn-secondary" style="padding: 8px 12px; color: var(--color-error); border-color: var(--color-error);" onclick="${callbackRechazar}('${solicitud.id}')" title="Rechazar">
                            ${ICONOS.accion.rechazar} Rechazar
                        </button>
                        <button class="btn btn-success" style="padding: 8px 12px; background: var(--color-success); border-color: var(--color-success); color: white;" onclick="${callbackAprobar}('${solicitud.id}')" title="Aprobar">
                            ${ICONOS.accion.aprobar} Aprobar
                        </button>
                    </div>
                ` : ''}
                ${extraBotonesHTML}
            </div>
        </div>
    `;
}

/**
 * Crea una tarjeta de solicitud para la vista de solicitante
 * @param {Object} solicitud - Datos de la solicitud
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaSolicitud(solicitud) {
    return crearTarjetaSolicitudBase(solicitud, {
        mostrarBotonesAprobacion: false,
        callbackVerDetalle: 'verDetalle'
    });
}

/**
 * Crea una tarjeta de solicitud para la vista de enlace (aprobador)
 * @param {Object} solicitud - Datos de la solicitud
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaSolicitudEnlace(solicitud) {
    return crearTarjetaSolicitudBase(solicitud, {
        mostrarBotonesAprobacion: true,
        estadosAprobables: [ESTADOS.PENDIENTE],
        callbackVerDetalle: 'verDetalleAprobacion',
        callbackAprobar: 'aprobarSolicitudDirecta',
        callbackRechazar: 'rechazarSolicitudDirecta'
    });
}

/**
 * Crea una tarjeta de solicitud para la vista de gerente (aprobador final)
 * @param {Object} solicitud - Datos de la solicitud
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaSolicitudGerente(solicitud) {
    return crearTarjetaSolicitudBase(solicitud, {
        mostrarBotonesAprobacion: true,
        estadosAprobables: [ESTADOS.SOLICITUD_GERENCIA, ESTADOS.EN_GERENTE],
        callbackVerDetalle: 'verDetalleAprobacion',
        callbackAprobar: 'aprobarSolicitudDirecta',
        callbackRechazar: 'rechazarSolicitudDirecta'
    });
}

/**
 * Crea una tarjeta de solicitud para la vista de responsable de caja
 * @param {Object} solicitud - Datos de la solicitud
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaSolicitudResponsable(solicitud) {
    const puedeDesembolsar = solicitud.estado === ESTADOS.RESPONSABLE_APROBADO;
    const extraBotonesHTML = puedeDesembolsar ? `
        <button class="btn btn-success" style="padding: 8px 12px; background: var(--color-success); border-color: var(--color-success); color: white;" onclick="mostrarModalDesembolso('${solicitud.id}')" title="Marcar como desembolsado">
            ${ICONOS.accion.aprobar} Desembolsado
        </button>
    ` : '';

    return crearTarjetaSolicitudBase(solicitud, {
        mostrarBotonesAprobacion: true,
        estadosAprobables: [ESTADOS.EN_RESPONSABLE],
        callbackVerDetalle: 'verDetalleAprobacion',
        callbackAprobar: 'aprobarSolicitudDirecta',
        callbackRechazar: 'rechazarSolicitudDirecta',
        extraBotonesHTML
    });
}

/**
 * Crea el HTML para estado vacío (sin solicitudes)
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de estado vacío ('sin-datos' o 'sin-resultados')
 * @returns {string} - HTML del estado vacío
 */
function crearEstadoVacio(mensaje, tipo = 'sin-datos') {
    const icono = tipo === 'sin-resultados' ? ICONOS.vacio.busqueda : ICONOS.vacio.archivo;
    const titulo = tipo === 'sin-resultados' ? 'No se encontraron resultados' : 'No hay solicitudes';

    return `
        <div class="empty-state">
            <div class="empty-state-icon">
                ${icono}
            </div>
            <h3>${titulo}</h3>
            <p>${mensaje}</p>
        </div>
    `;
}
