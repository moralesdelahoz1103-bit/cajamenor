/* ========================================
   COMPONENTE: PROGRESS TRACKER
   ========================================
   Archivo: progress-tracker.js
   Propósito: Crea el visualizador de progreso
   de solicitudes con 5 pasos
   ======================================== */

/**
 * Crea el HTML del progress tracker según el estado de la solicitud
 * @param {string} estado - Estado actual de la solicitud
 * @param {Array} historial - Historial de cambios de la solicitud (opcional)
 * @returns {string} - HTML del progress tracker
 */
function crearProgressTracker(estado, historial = []) {
    const estadoInfo = obtenerInfoEstado(estado, historial);
    const estadoIndex = estadoInfo.index;
    const esRechazado = estado === ESTADOS.NEGADO;
    
    return STEPS_PROGRESO.map((step, index) => {
        let claseStep = '';
        
        if (esRechazado && index === estadoIndex) {
            // Si está rechazado, marca en rojo el paso donde se rechazó
            claseStep = 'rejected';
        } else if (index < estadoIndex) {
            // Pasos anteriores completados en verde
            claseStep = 'completed';
        } else if (index === estadoIndex && !esRechazado) {
            // Paso actual activo en verde
            claseStep = 'active';
        }
        // Si no cumple ninguna condición, queda sin clase (gris/inactivo)
        
        return `
            <div class="progress-step ${claseStep}">
                <div class="progress-step-circle">
                    ${step.icon}
                </div>
                <div class="progress-step-label">${step.label}</div>
            </div>
        `;
    }).join('');
}

/**
 * Obtiene información del estado incluyendo el índice y el paso donde se encuentra
 * @param {string} estado - Estado de la solicitud
 * @param {Array} historial - Historial de cambios de la solicitud
 * @returns {Object} - Objeto con index y stepId
 */
function obtenerInfoEstado(estado, historial = []) {
    // Si está rechazado, determinar en qué etapa se rechazó según el historial
    if (estado === ESTADOS.NEGADO && historial && historial.length > 0) {
        const eventoRechazo = historial.find(h => 
            h.estado === ESTADOS.NEGADO || 
            h.area?.toLowerCase().includes('rechaz')
        );
        
        if (eventoRechazo) {
            const area = eventoRechazo.area?.toLowerCase() || '';
            
            // Determinar en qué paso se rechazó según el área
            if (area.includes('gerencia') || area.includes('gerente')) {
                return { index: 1, stepId: 'gerencia' }; // Rechazado en gerencia
            } else if (area.includes('caja') || area.includes('responsable')) {
                return { index: 2, stepId: 'caja' }; // Rechazado en caja
            } else {
                return { index: 0, stepId: 'enlace' }; // Rechazado en enlace (por defecto)
            }
        }
    }
    
    switch (estado) {
        case ESTADOS.PENDIENTE:
            // La solicitud está pendiente de revisión del Enlace
            return { index: 0, stepId: 'enlace' };
        case ESTADOS.SOLICITUD_GERENCIA:
            // El enlace la aprobó, ahora está en gerencia esperando aprobación
            return { index: 1, stepId: 'gerencia' };
        case ESTADOS.EN_GERENTE:
            // Está siendo revisada por el gerente
            return { index: 1, stepId: 'gerencia' };
        case ESTADOS.EN_RESPONSABLE:
            // Está en caja/responsable
            return { index: 2, stepId: 'caja' };
        case ESTADOS.RESPONSABLE_APROBADO:
            // Aprobado en caja, pendiente de desembolso
            return { index: 2, stepId: 'caja' };
        case ESTADOS.DESEMBOLSADO:
            // Proceso completado
            return { index: 3, stepId: 'desembolso' };
        case ESTADOS.NEGADO:
            // Rechazado en enlace (paso 0 por defecto)
            return { index: 0, stepId: 'enlace' };
        default:
            return { index: 0, stepId: 'enlace' };
    }
}
