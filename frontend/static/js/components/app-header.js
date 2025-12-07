/**
 * Componente Header Reutilizable
 * Uso: <app-header active-page="panel_solicitudes" user-name="Nombre Usuario" user-role="Rol"></app-header>
 */
class AppHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active-page') || '';
        const userName = this.getAttribute('user-name') || 'Usuario';
        const userRole = this.getAttribute('user-role') || 'Rol';
        const userInitials = this.getAttribute('user-initials') || this.getInitials(userName);
        
        this.innerHTML = `
            <header class="header">
                <div class="header-brand">
                    <div class="logo-icon">
                        <img src="../static/img/logotipo.png" alt="Fundación Santo Domingo"/>  
                    </div>
                    <div class="brand-info">
                        <h1>Caja Menor</h1>
                        <p>-----</p>
                    </div>
                </div>
                <nav class="header-nav">
                    <a href="panel_solicitudes.html" class="nav-button ${activePage === 'panel_solicitudes' ? 'active' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Solicitante
                    </a>
                    <a href="enlace_solicitudes.html" class="nav-button ${activePage === 'enlace_solicitudes' ? 'active' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                        </svg>
                        Enlace
                    </a>
                    <a href="gerente_solicitudes.html" class="nav-button ${activePage === 'gerente_solicitudes' ? 'active' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                            <path d="M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                        Gerente
                    </a>
                    <a href="responsable_solicitudes.html" class="nav-button ${activePage === 'responsable_solicitudes' ? 'active' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                        Responsable
                    </a>
                </nav>
                <div class="header-user">
                    <div class="user-info">
                        <div class="user-name">${userName}</div>
                        <div class="user-role">${userRole}</div>
                    </div>
                    <div class="user-avatar">${userInitials}</div>
                </div>
            </header>
        `;
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}

// Registrar el componente
customElements.define('app-header', AppHeader);
