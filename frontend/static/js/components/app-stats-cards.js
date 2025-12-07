/**
 * Componente de Tarjetas de Estadísticas
 * Uso: <app-stats-cards view-type="gerente"></app-stats-cards>
 * 
 * view-type puede ser: "solicitante", "enlace", "gerente"
 */
class AppStatsCards extends HTMLElement {
    connectedCallback() {
        const viewType = this.getAttribute('view-type') || 'solicitante';
        
        // Determinar qué tarjetas mostrar según el tipo de vista
        const isSolicitante = viewType === 'solicitante';
        const suffix = isSolicitante ? '' : viewType.charAt(0).toUpperCase() + viewType.slice(1);
        
        this.innerHTML = `
            <div class="stats-grid" id="statsGrid${suffix}">
                <div class="stat-card total">
                    <div class="stat-content">
                        <h3>Total</h3>
                        <div class="stat-value" id="statTotal${suffix}">0</div>
                    </div>
                    <div class="stat-card-icon blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card pendientes">
                    <div class="stat-content">
                        <h3>Pendientes</h3>
                        <div class="stat-value" id="statPendientes${suffix}">0</div>
                    </div>
                    <div class="stat-card-icon yellow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card aprobadas">
                    <div class="stat-content">
                        <h3>Aprobadas</h3>
                        <div class="stat-value" id="statAprobadas${suffix}">0</div>
                    </div>
                    <div class="stat-card-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <path d="M22 4L12 14.01l-3-3"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card rechazadas">
                    <div class="stat-content">
                        <h3>Rechazadas</h3>
                        <div class="stat-value" id="statRechazadas${suffix}">0</div>
                    </div>
                    <div class="stat-card-icon red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    </div>
                </div>
                ${isSolicitante ? `
                <div class="stat-card desembolsado">
                    <div class="stat-content">
                        <h3>Desembolsado</h3>
                        <div class="stat-value" id="statDesembolsado">$ 0</div>
                        <div class="stat-subtitle">Total recibido</div>
                    </div>
                    <div class="stat-card-icon blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('app-stats-cards', AppStatsCards);
