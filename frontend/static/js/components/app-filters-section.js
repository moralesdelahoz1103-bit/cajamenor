/**
 * Componente de Filtros
 * Uso: <app-filters-section view-type="gerente" clear-function="limpiarFiltrosGerente"></app-filters-section>
 * 
 * view-type: "solicitante" (sin filtro de solicitante), "enlace" o "gerente" (con filtro de solicitante)
 */
class AppFiltersSection extends HTMLElement {
    connectedCallback() {
        const viewType = this.getAttribute('view-type') || 'solicitante';
        const clearFunction = this.getAttribute('clear-function') || 'limpiarFiltros';
        const showSolicitanteFilter = viewType !== 'solicitante';
        
        this.innerHTML = `
            <div class="filters-section">
                <div class="filters-grid" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
                    <div class="filter-group">
                        <label class="filter-label">Búsqueda</label>
                        <input type="text" class="filter-input" id="busqueda" placeholder="Número o nombre de la solicitud...">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Desde</label>
                        <input type="date" class="filter-input" id="filtroFechaInicio">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Hasta</label>
                        <input type="date" class="filter-input" id="filtroFechaFin">
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Estado</label>
                        <select class="filter-input" id="filtroEstado">
                            <option value="">Todos</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En gerente">En gerente</option>
                            <option value="En responsable">En responsable</option>
                            <option value="Desembolsado">Desembolsado</option>
                            <option value="Negado">Negado</option>
                        </select>
                    </div>
                    <div class="filter-group" style="align-self: end;">
                        <button class="btn-clear-filters" id="btnLimpiarFiltros" style="display: none;" onclick="${clearFunction}()" title="Limpiar filtros">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-filters-section', AppFiltersSection);
