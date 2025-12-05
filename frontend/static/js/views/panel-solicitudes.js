/* ========================================
   VISTA: PANEL SOLICITUDES (Solicitante)
   ========================================
   Archivo: panel-solicitudes.js
   Propósito: Lógica específica para la vista
   del panel del solicitante
   ======================================== */

// Variable global para almacenar solicitudes
let solicitudesData = [];

/**
 * Inicializa la vista del panel de solicitudes
 */
function inicializarPanelSolicitudes() {
    cargarDatos();
    renderizarSolicitudes();
    actualizarEstadisticas();
    configurarFiltros();
    inicializarEventosModales();
}

/**
 * Carga los datos desde localStorage
 */
function cargarDatos() {
    solicitudesData = cargarDeLocalStorage();
}

/**
 * Renderiza todas las solicitudes en la lista
 * @param {Array} solicitudes - Array de solicitudes a renderizar (opcional)
 */
function renderizarSolicitudes(solicitudes = solicitudesData) {
    const container = document.getElementById('listaSolicitudes');
    if (!container) return;
    
    if (solicitudes.length === 0) {
        container.innerHTML = crearEstadoVacio(
            'No tienes solicitudes de caja menor. Crea una nueva solicitud haciendo clic en el botón +',
            'sin-datos'
        );
        return;
    }
    
    container.innerHTML = solicitudes.map(sol => crearTarjetaSolicitud(sol)).join('');
}

/**
 * Actualiza las estadísticas del dashboard
 */
function actualizarEstadisticas() {
    const total = solicitudesData.length;
    const pendientes = solicitudesData.filter(s => s.estado === ESTADOS.PENDIENTE).length;
    const aprobadas = solicitudesData.filter(s => 
        s.estado === ESTADOS.SOLICITUD_GERENCIA || 
        s.estado === ESTADOS.EN_GERENTE || 
        s.estado === ESTADOS.EN_RESPONSABLE
    ).length;
    const rechazadas = solicitudesData.filter(s => s.estado === ESTADOS.NEGADO).length;
    const desembolsado = solicitudesData.filter(s => s.estado === ESTADOS.DESEMBOLSADO)
        .reduce((sum, s) => sum + parseFloat(s.monto), 0);
    
    // Actualizar valores en el DOM
    const elementos = {
        'statTotal': total,
        'statPendientes': pendientes,
        'statAprobadas': aprobadas,
        'statRechazadas': rechazadas,
        'statDesembolsado': `$ ${formatearMonto(desembolsado)}`
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

/**
 * Configura los filtros de búsqueda y ordenamiento
 */
function configurarFiltros() {
    const inputBusqueda = document.getElementById('busqueda');
    const inputFechaInicio = document.getElementById('filtroFechaInicio');
    const inputFechaFin = document.getElementById('filtroFechaFin');
    const selectEstado = document.getElementById('filtroEstado');
    const selectOrden = document.getElementById('ordenar');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', debounce(aplicarFiltros, 300));
    }
    
    if (inputFechaInicio) {
        inputFechaInicio.addEventListener('change', aplicarFiltros);
    }
    
    if (inputFechaFin) {
        inputFechaFin.addEventListener('change', aplicarFiltros);
    }
    
    if (selectEstado) {
        selectEstado.addEventListener('change', aplicarFiltros);
    }
    
    if (selectOrden) {
        selectOrden.addEventListener('change', aplicarFiltros);
    }
}

/**
 * Aplica los filtros seleccionados y renderiza
 */
function aplicarFiltros() {
    const busqueda = document.getElementById('busqueda')?.value.toLowerCase() || '';
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
    
    // Mostrar/ocultar botón de limpiar filtros
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiar) {
        const hayFiltros = busqueda || fechaInicio || fechaFin || estadoSeleccionado || orden;
        btnLimpiar.style.display = hayFiltros ? 'flex' : 'none';
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
    
    renderizarSolicitudes(filtradas);
}

/**
 * Abre el modal para crear nueva solicitud
 */
function nuevaSolicitud() {
    // Limpiar formulario
    const form = document.getElementById('formNuevaSolicitud');
    if (form) form.reset();
    
    abrirModal('modalNuevaSolicitud');
}

/**
 * Guarda una nueva solicitud
 */
function guardarSolicitud(event) {
    if (event) event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('inputNombre')?.value;
    const sede = document.getElementById('inputSede')?.value;
    const monto = document.getElementById('inputMonto')?.value;
    const centroCosto = document.getElementById('inputCentroCosto')?.value;
    const concepto = document.getElementById('inputConcepto')?.value;
    const aprobador = document.getElementById('inputAprobador')?.value;
    
    // Validaciones
    if (estaVacio(nombre) || estaVacio(sede) || estaVacio(monto) || 
        estaVacio(centroCosto) || estaVacio(concepto) || estaVacio(aprobador)) {
        alert('Por favor completa todos los campos');
        return false;
    }
    
    if (!esMontoValido(monto)) {
        alert('El monto debe ser un número válido mayor a 0');
        return false;
    }
    
    // Generar número de solicitud automático
    const numero = generarNumeroSolicitud();
    const fechaHora = obtenerFechaHoraActual();
    
    // Crear nueva solicitud
    const nuevaSolicitud = {
        id: numero,
        numero: numero,
        fecha: fechaHora.fecha,
        solicitante: 'Juan Pérez', // Usuario actual del sistema
        nombre: nombre.trim(),
        sede: sede.trim(),
        monto: parseFloat(monto),
        centroCosto: centroCosto.trim(),
        concepto: concepto.trim(),
        aprobador: aprobador.trim(),
        estado: ESTADOS.PENDIENTE,
        observaciones: '',
        historial: [
            {
                area: 'Solicitud creada',
                estado: ESTADOS.PENDIENTE,
                fecha: fechaHora.fecha,
                hora: fechaHora.hora,
                timestamp: fechaHora.timestamp,
                usuario: 'Juan Pérez'
            }
        ]
    };
    
    // Agregar a la lista
    solicitudesData.unshift(nuevaSolicitud);
    
    // Guardar en localStorage
    guardarEnLocalStorage(solicitudesData);
    
    // Actualizar UI
    renderizarSolicitudes();
    actualizarEstadisticas();
    cerrarModal('modalNuevaSolicitud');
    
    // Mostrar mensaje de éxito
    alert(`Solicitud ${numero} creada exitosamente`);
    return false;
}

/**
 * Muestra el detalle de una solicitud
 * @param {number} id - ID de la solicitud
 */
function verDetalle(id) {
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
        

        
    `;
    
    document.getElementById('modalDetalleContenido').innerHTML = contenido;
    abrirModal('modalDetalleSolicitud');
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
        if (evento.area.toLowerCase().includes('enlace')) {
            if (esRechazo) {
                areaText = 'Enlace - Solicitud rechazada';
            } else if (esAprobacion) {
                areaText = 'Enlace - Solicitud aprobada';
            } else {
                areaText = 'Enlace';
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
function limpiarFiltros() {
    // Limpiar inputs
    const busqueda = document.getElementById('busqueda');
    const fechaInicio = document.getElementById('filtroFechaInicio');
    const fechaFin = document.getElementById('filtroFechaFin');
    const estado = document.getElementById('filtroEstado');
    const orden = document.getElementById('ordenar');
    
    if (busqueda) busqueda.value = '';
    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    if (estado) estado.value = '';
    if (orden) orden.value = '';
    
    // Aplicar filtros (mostrará todas las solicitudes)
    aplicarFiltros();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPanelSolicitudes);
} else {
    inicializarPanelSolicitudes();
}
