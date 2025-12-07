/**
 * Componente de Lista de Solicitudes con Modal
 * Uso: <app-solicitudes-list></app-solicitudes-list>
 */
class AppSolicitudesList extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Solicitudes List -->
            <div class="solicitudes-list" id="listaSolicitudes">
                <!-- Se llena dinámicamente -->
            </div>

            <!-- Modal: Detalle y Aprobación -->
            <div class="modal-overlay" id="modalAprobacionSolicitud">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title" id="modalAprobacionTitle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Detalle de Solicitud
                        </h2>
                        <button class="modal-close" onclick="cerrarModal('modalAprobacionSolicitud')">×</button>
                    </div>
                    <div class="modal-body" id="modalAprobacionContenido">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-solicitudes-list', AppSolicitudesList);
