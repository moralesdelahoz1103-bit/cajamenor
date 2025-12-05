/* ========================================
   VISTA: GERENTE SOLICITUDES (Aprobador Final)
   ========================================
   Archivo: gerente-solicitudes.js
   Propósito: Lógica específica para la vista
   del panel de aprobación final de gerencia
   ======================================== */

// Variable global para almacenar solicitudes
let solicitudesData = [];
let solicitudActualId = null;

/**
 * Inicializa la vista de gerente/aprobación final
 */
function inicializarGerenteSolicitudes() {
    cargarDatos();
    renderizarSolicitudesGerente();
    actualizarEstadisticasGerente();
    configurarFiltrosGerente();
    llenarListaSolicitantes();
    inicializarEventosModales();
}

/**
 * Carga los datos desde localStorage
 */
function cargarDatos() {
    solicitudesData = cargarDeLocalStorage();
}

/**
 * Renderiza todas las solicitudes para vista de gerente
 * @param {Array} solicitudes - Array de solicitudes a renderizar (opcional)
 */
function renderizarSolicitudesGerente(solicitudes = solicitudesData) {
    const container = document.getElementById('listaSolicitudes');
    if (!container) return;
    
    if (solicitudes.length === 0) {
        container.innerHTML = crearEstadoVacio(
            'No hay solicitudes para revisar en este momento.',
            'sin-datos'
        );
        return;
    }
    
    container.innerHTML = solicitudes.map(sol => crearTarjetaSolicitudGerente(sol)).join('');
}

/**
 * Actualiza las estadísticas del dashboard de gerente
 */
function actualizarEstadisticasGerente() {
    const total = solicitudesData.length;
    const pendientes = solicitudesData.filter(s => 
        s.estado === ESTADOS.SOLICITUD_GERENCIA || 
        s.estado === ESTADOS.EN_GERENTE
    ).length;
    const aprobadas = solicitudesData.filter(s => 
        s.estado === ESTADOS.EN_RESPONSABLE ||
        s.estado === ESTADOS.DESEMBOLSADO
    ).length;
    const rechazadas = solicitudesData.filter(s => s.estado === ESTADOS.NEGADO).length;
    
    // Actualizar valores en el DOM
    const elementos = {
        'statTotalGerente': total,
        'statPendientesGerente': pendientes,
        'statAprobadasGerente': aprobadas,
        'statRechazadasGerente': rechazadas
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

/**
 * Configura los filtros específicos de la vista de gerente
 */
function configurarFiltrosGerente() {
    const inputBusqueda = document.getElementById('busqueda');
    const inputSolicitante = document.getElementById('filtroSolicitante');
    const inputFechaInicio = document.getElementById('filtroFechaInicio');
    const inputFechaFin = document.getElementById('filtroFechaFin');
    const selectEstado = document.getElementById('filtroEstado');
    const selectOrden = document.getElementById('ordenar');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', debounce(aplicarFiltrosGerente, 300));
    }
    
    if (inputSolicitante) {
        inputSolicitante.addEventListener('input', debounce(aplicarFiltrosGerente, 300));
    }
    
    if (inputFechaInicio) {
        inputFechaInicio.addEventListener('change', aplicarFiltrosGerente);
    }
    
    if (inputFechaFin) {
        inputFechaFin.addEventListener('change', aplicarFiltrosGerente);
    }
    
    if (selectEstado) {
        selectEstado.addEventListener('change', aplicarFiltrosGerente);
    }
    
    if (selectOrden) {
        selectOrden.addEventListener('change', aplicarFiltrosGerente);
    }
}

/**
 * Aplica los filtros y renderiza
 */
function aplicarFiltrosGerente() {
    const busqueda = document.getElementById('busqueda')?.value.toLowerCase() || '';
    const solicitante = document.getElementById('filtroSolicitante')?.value.toLowerCase() || '';
    const fechaInicio = document.getElementById('filtroFechaInicio')?.value || '';
    const fechaFin = document.getElementById('filtroFechaFin')?.value || '';
    const estadoSeleccionado = document.getElementById('filtroEstado')?.value || '';
    const orden = document.getElementById('ordenar')?.value || '';
    
    let filtradas = [...solicitudesData];
    
    // Filtro de búsqueda por número o nombre
    if (busqueda) {
        filtradas = filtradas.filter(s => 
            s.numero.toLowerCase().includes(busqueda) ||
            s.nombre.toLowerCase().includes(busqueda)
        );
    }
    
    // Filtro de solicitante
    if (solicitante) {
        filtradas = filtradas.filter(s => 
            s.solicitante.toLowerCase().includes(solicitante)
        );
    }
    
    // Filtro de rango de fechas
    if (fechaInicio || fechaFin) {
        filtradas = filtradas.filter(s => {
            const fechaSolicitud = convertirFecha(s.fecha);
            // Convertir las fechas del input (yyyy-mm-dd) a Date
            const inicio = fechaInicio ? new Date(fechaInicio + 'T00:00:00') : new Date('1900-01-01');
            const fin = fechaFin ? new Date(fechaFin + 'T23:59:59') : new Date('2100-12-31');
            return fechaSolicitud >= inicio && fechaSolicitud <= fin;
        });
    }
    
    // Filtro de estado
    if (estadoSeleccionado) {
        filtradas = filtradas.filter(s => s.estado === estadoSeleccionado);
    }
    
    // Ordenamiento
    if (orden) {
        filtradas.sort((a, b) => {
            const fechaA = convertirFecha(a.fecha);
            const fechaB = convertirFecha(b.fecha);
            return orden === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
        });
    }
    
    // Mostrar/ocultar botón de limpiar filtros
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiar) {
        const hayFiltros = busqueda || solicitante || fechaInicio || fechaFin || estadoSeleccionado || orden;
        btnLimpiar.style.display = hayFiltros ? 'flex' : 'none';
    }
    
    renderizarSolicitudesGerente(filtradas);
}

/**
 * Llena el datalist con los solicitantes únicos
 */
function llenarListaSolicitantes() {
    const datalist = document.getElementById('listaSolicitantes');
    if (!datalist) return;
    
    const solicitantesUnicos = [...new Set(solicitudesData.map(s => s.solicitante))];
    datalist.innerHTML = solicitantesUnicos.map(s => `<option value="${s}">`).join('');
}

/**
 * Muestra el detalle de una solicitud para aprobar/rechazar
 * @param {number} id - ID de la solicitud
 */
function verDetalleAprobacion(id) {
    solicitudActualId = id;
    const solicitud = solicitudesData.find(s => s.id === id);
    if (!solicitud) return;
    
    const contenido = `
        <!-- Header con estado -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid var(--color-border);">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--color-text-primary);">${solicitud.nombre}</h3>
            <div class="badge ${obtenerClaseEstado(solicitud.estado)}" style="font-size: 12px;">
                ${obtenerIconoEstado(solicitud.estado)}
                ${solicitud.estado}
            </div>
        </div>
        
        <!-- Información compacta en formato lista -->
        <div style="display: grid; gap: 12px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Número de solicitud</span>
                    <span style="font-size: 14px; color: var(--color-text-primary); font-weight: 600;">${solicitud.numero}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Fecha</span>
                    <span style="font-size: 14px; color: var(--color-text-primary);">${solicitud.fecha}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Solicitante</span>
                    <span style="font-size: 14px; color: var(--color-text-primary);">${solicitud.solicitante}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Sede</span>
                    <span style="font-size: 14px; color: var(--color-text-primary);">${solicitud.sede || 'N/A'}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-success); flex-shrink: 0;">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Monto</span>
                    <span style="font-size: 16px; color: var(--color-success); font-weight: 700;">$ ${formatearMonto(solicitud.monto)}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Centro de costo</span>
                    <span style="font-size: 14px; color: var(--color-text-primary);">${solicitud.centroCosto}</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--color-background); border-radius: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>
                </svg>
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--color-text-secondary); font-weight: 500;">Aprobador</span>
                    <span style="font-size: 14px; color: var(--color-text-primary);">${solicitud.aprobador || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <!-- Concepto -->
        <div style="padding: 12px; background: var(--color-background); border-radius: 8px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Concepto</div>
            <div style="font-size: 14px; color: var(--color-text-primary); line-height: 1.6;">${solicitud.concepto || solicitud.nombre}</div>
        </div>
        
        
        ${solicitud.historial && solicitud.historial.length > 0 ? `
            <div class="historial-section" style="margin-top: 24px;">
                <div class="historial-label" style="font-size: 14px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    Historial de cambios
                </div>
                <div class="historial-timeline">
                    ${crearHistorialTimeline(solicitud.historial)}
                </div>
            </div>
        ` : ''}
        
        ${(solicitud.estado === ESTADOS.SOLICITUD_GERENCIA || solicitud.estado === ESTADOS.EN_GERENTE) ? `
            <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn btn-secondary" style="flex: 1; color: var(--color-error); border-color: var(--color-error);" onclick="mostrarModalRechazo()">
                    ${ICONOS.accion.rechazar}
                    Rechazar solicitud
                </button>
                <button class="btn btn-primary" style="flex: 1;" onclick="aprobarSolicitud()">
                    ${ICONOS.accion.aprobar}
                    Aprobar solicitud
                </button>
            </div>
        ` : ''}
        
        ${solicitud.estado === ESTADOS.NEGADO && solicitud.observaciones ? `
            <div class="alert alert-error" style="margin-top: 16px;">
                <span class="alert-icon">${ICONOS.accion.advertencia}</span>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Motivo del rechazo:</div>
                    ${solicitud.observaciones}
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('modalAprobacionContenido').innerHTML = contenido;
    abrirModal('modalAprobacionSolicitud');
}

/**
 * Aprueba la solicitud actual
 */
function aprobarSolicitud() {
    if (!solicitudActualId) return;
    
    const solicitud = solicitudesData.find(s => s.id === solicitudActualId);
    if (!solicitud) return;
    
    const fechaHora = obtenerFechaHoraActual();
    
    // Avanzar al siguiente estado
    solicitud.estado = ESTADOS.EN_RESPONSABLE;
    solicitud.observaciones = '';
    
    // Registrar en historial
    if (!solicitud.historial) solicitud.historial = [];
    solicitud.historial.push({
        area: 'Gerencia',
        estado: ESTADOS.EN_RESPONSABLE,
        fecha: fechaHora.fecha,
        hora: fechaHora.hora,
        timestamp: fechaHora.timestamp,
        usuario: 'Gerente General'
    });
    
    guardarEnLocalStorage(solicitudesData);
    renderizarSolicitudesGerente();
    actualizarEstadisticasGerente();
    cerrarModal('modalAprobacionSolicitud');
    
    alert('Solicitud aprobada exitosamente. La solicitud ha avanzado a la siguiente fase.');
    solicitudActualId = null;
}

/**
 * Muestra modal para ingresar motivo de rechazo
 */
function mostrarModalRechazo() {
    const solicitud = solicitudesData.find(s => s.id === solicitudActualId);
    if (!solicitud) return;
    
    const motivosComunes = [
        'No cuenta con presupuesto',
        'El concepto no se encuentra en los alcances de la caja mejor',
        'El monto propuesto requiere ajustes'
    ];
    
    const opcionesHTML = motivosComunes.map((motivo, index) => 
        `<option value="${motivo}">${motivo}</option>`
    ).join('');
    
    const modalHTML = `
        <div class="modal-overlay" id="modalRechazo" style="display: flex;">
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 class="modal-title">
                        ${ICONOS.accion.advertencia}
                        Confirmar Rechazo
                    </h2>
                    <button class="modal-close" onclick="cerrarModalRechazo()">×</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px; color: var(--color-text-secondary);">
                        Estás a punto de rechazar la solicitud <strong>${solicitud.numero}</strong>. 
                        Por favor selecciona o especifica el motivo del rechazo:
                    </p>
                    <div class="form-field full">
                        <label class="form-label">Motivo del rechazo</label>
                        <select class="form-select" id="selectMotivoRechazo" onchange="toggleOtroMotivo()">
                            ${opcionesHTML}
                        </select>
                    </div>
                    <div class="form-field full" id="otroMotivoContainer" style="display: none; margin-top: 12px;">
                        <label class="form-label">Especifica el motivo</label>
                        <textarea class="form-textarea" id="inputOtroMotivo" placeholder="Describe el motivo del rechazo..." rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModalRechazo()">Cancelar</button>
                    <button type="button" class="btn btn-primary" style="background: var(--color-error); border-color: var(--color-error);" onclick="confirmarRechazo()">Confirmar Rechazo</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);
}

/**
 * Cierra el modal de rechazo
 */
function cerrarModalRechazo() {
    const modal = document.getElementById('modalRechazo');
    if (modal) {
        modal.remove();
    }
}

/**
 * Muestra/oculta el campo de otro motivo
 */
function toggleOtroMotivo() {
    const select = document.getElementById('selectMotivoRechazo');
    const container = document.getElementById('otroMotivoContainer');
    
    if (select && container) {
        container.style.display = select.value === 'Otro motivo' ? 'block' : 'none';
    }
}

/**
 * Confirma el rechazo con el motivo seleccionado
 */
function confirmarRechazo() {
    const select = document.getElementById('selectMotivoRechazo');
    const inputOtro = document.getElementById('inputOtroMotivo');
    
    let motivo = select?.value || 'Falta de presupuesto';
    
    if (motivo === 'Otro motivo') {
        motivo = inputOtro?.value.trim() || 'Motivo no especificado';
    }
    
    if (!solicitudActualId) {
        cerrarModalRechazo();
        return;
    }
    
    const solicitud = solicitudesData.find(s => s.id === solicitudActualId);
    if (!solicitud) {
        cerrarModalRechazo();
        return;
    }
    
    const fechaHora = obtenerFechaHoraActual();
    
    // Actualizar estado a Negado
    solicitud.estado = ESTADOS.NEGADO;
    solicitud.observaciones = motivo;
    
    // Registrar en historial
    if (!solicitud.historial) solicitud.historial = [];
    solicitud.historial.push({
        area: 'Gerencia - Solicitud rechazada',
        estado: ESTADOS.NEGADO,
        fecha: fechaHora.fecha,
        hora: fechaHora.hora,
        timestamp: fechaHora.timestamp,
        usuario: 'Gerente General',
        observaciones: motivo
    });
    
    guardarEnLocalStorage(solicitudesData);
    renderizarSolicitudesGerente();
    actualizarEstadisticasGerente();
    cerrarModalRechazo();
    cerrarModal('modalAprobacionSolicitud');
    
    alert(`Solicitud rechazada. Motivo: ${motivo}`);
    solicitudActualId = null;
}

/**
 * Aprueba una solicitud directamente desde la tarjeta
 */
function aprobarSolicitudDirecta(id) {
    const solicitud = solicitudesData.find(s => s.id === id);
    if (!solicitud) return;
    
    if (solicitud.estado !== ESTADOS.SOLICITUD_GERENCIA && solicitud.estado !== ESTADOS.EN_GERENTE) {
        alert('Esta solicitud ya no está pendiente de aprobación en gerencia.');
        return;
    }
    
    if (confirm(`¿Aprobar la solicitud ${solicitud.numero}?`)) {
        const fechaHora = obtenerFechaHoraActual();
        
        solicitud.estado = ESTADOS.EN_RESPONSABLE;
        solicitud.observaciones = '';
        
        // Registrar en historial
        if (!solicitud.historial) solicitud.historial = [];
        solicitud.historial.push({
            area: 'Gerencia - Solicitud aprobada',
            estado: ESTADOS.EN_RESPONSABLE,
            fecha: fechaHora.fecha,
            hora: fechaHora.hora,
            timestamp: fechaHora.timestamp,
            usuario: 'Gerente General'
        });
        
        guardarEnLocalStorage(solicitudesData);
        renderizarSolicitudesGerente();
        actualizarEstadisticasGerente();
        
        alert('Solicitud aprobada exitosamente.');
    }
}

/**
 * Rechaza una solicitud directamente desde la tarjeta
 */
function rechazarSolicitudDirecta(id) {
    solicitudActualId = id;
    mostrarModalRechazo();
}

/**
 * Crea el HTML de la línea de tiempo del historial
 * @param {Array} historial - Array de eventos del historial
 * @returns {string} - HTML de la línea de tiempo
 */
function crearHistorialTimeline(historial) {
    if (!historial || historial.length === 0) return '';
    
    // Ordenar por timestamp descendente (más reciente primero)
    const historialOrdenado = [...historial].sort((a, b) => b.timestamp - a.timestamp);
    
    return historialOrdenado.map((evento, index) => {
        const esRechazo = evento.estado === ESTADOS.NEGADO || evento.area.toLowerCase().includes('rechaz');
        const esAprobacion = evento.area.toLowerCase().includes('aprobad');
        const iconoBg = esRechazo ? '#ffebee' : 'var(--color-primary-light)';
        const iconoColor = esRechazo ? 'var(--color-error)' : 'var(--color-primary)';
        const iconoSvg = esRechazo ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
        ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <path d="M22 4L12 14.01l-3-3"/>
            </svg>
        `;
        
        // Determinar el texto del área con status
        let areaText = evento.area;
        if (evento.area.toLowerCase().includes('gerencia')) {
            if (esRechazo) {
                areaText = 'Gerencia - Solicitud rechazada';
            } else if (esAprobacion) {
                areaText = 'Gerencia - Solicitud aprobada';
            } else {
                areaText = 'Gerencia';
            }
        }
        
        return `
        <div class="historial-item" style="display: flex; gap: 16px; padding: 12px 0; ${index !== historialOrdenado.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
            <div class="historial-icon" style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: ${iconoBg}; display: flex; align-items: center; justify-content: center; color: ${iconoColor};">
                ${iconoSvg}
            </div>
            <div class="historial-content" style="flex: 1;">
                <div class="historial-area" style="font-weight: 600; font-size: 14px; color: var(--color-text-primary); margin-bottom: 4px;">
                    ${areaText}
                </div>
                <div class="historial-timestamp" style="font-size: 13px; color: var(--color-text-secondary);">
                    ${evento.hora} - ${evento.fecha}
                </div>
                ${evento.usuario ? `
                    <div class="historial-usuario" style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">
                        Por: ${evento.usuario}
                    </div>
                ` : ''}
                ${evento.observaciones ? `
                    <div class="historial-obs" style="font-size: 13px; color: var(--color-text-secondary); margin-top: 6px; padding: 8px; background: var(--color-background); border-radius: 6px;">
                        <strong>Motivo:</strong> ${evento.observaciones}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    }).join('');
}



/**
 * Limpia todos los filtros y muestra todas las solicitudes
 */
function limpiarFiltrosGerente() {
    // Limpiar inputs
    const busqueda = document.getElementById('busqueda');
    const solicitante = document.getElementById('filtroSolicitante');
    const fechaInicio = document.getElementById('filtroFechaInicio');
    const fechaFin = document.getElementById('filtroFechaFin');
    const estado = document.getElementById('filtroEstado');
    const orden = document.getElementById('ordenar');
    
    if (busqueda) busqueda.value = '';
    if (solicitante) solicitante.value = '';
    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    if (estado) estado.value = '';
    if (orden) orden.value = '';
    
    // Aplicar filtros (mostrará todas las solicitudes)
    aplicarFiltrosGerente();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGerenteSolicitudes);
} else {
    inicializarGerenteSolicitudes();
}
