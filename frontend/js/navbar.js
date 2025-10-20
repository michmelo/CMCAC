// Componente de navegación compartido con Bootstrap

function loadNavbar() {
    // Detectar si estamos en una subcarpeta (pages/)
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../' : '';
    const pagesPath = isInPages ? '' : 'pages/';
    
    // Obtener la página actual para marcar el enlace activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark shadow-sm" style="background: linear-gradient(135deg, #274c77 0%, #6096ba 100%);">
            <div class="container-fluid px-3 px-lg-4">
                <a class="navbar-brand d-flex align-items-center fw-bold" href="${basePath}index.html">
                    <i class="bi bi-building me-2 fs-4"></i>
                    <span class="d-none d-md-inline">CMC AUDITORES Y CONSULTORES</span>
                    <span class="d-md-none">CMCAC</span>
                </a>
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto align-items-lg-center">
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'index.html' ? 'active' : ''}" href="${basePath}index.html">
                                <i class="bi bi-house-door me-1"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'procesar.html' ? 'active' : ''}" href="${pagesPath}procesar.html">
                                <i class="bi bi-gear-fill me-1"></i>
                                Procesar
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'consultas.html' ? 'active' : ''}" href="${pagesPath}consultas.html">
                                <i class="bi bi-search me-1"></i>
                                Consultas
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'reportes.html' ? 'active' : ''}" href="${pagesPath}reportes.html">
                                <i class="bi bi-file-earmark-bar-graph me-1"></i>
                                Reportes
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'reglas.html' ? 'active' : ''}" href="${pagesPath}reglas.html">
                                <i class="bi bi-list-check me-1"></i>
                                Reglas
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-3 py-2 ${currentPage === 'errores.html' ? 'active' : ''}" href="${pagesPath}errores.html">
                                <i class="bi bi-exclamation-triangle me-1"></i>
                                Errores
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
    }
}

function loadFooter() {
    const footerHTML = `
        <div class="footer">
            <p>&copy; 2024 CMC AUDITORES Y CONSULTORES</p>
            <p>Sistema de Gestión de Comisiones de Auditores - Versión 1.0</p>
            <p style="font-size: 0.9em; margin-top: 8px; opacity: 0.85;">Excelencia en Auditoría y Consultoría desde 2012</p>
        </div>
    `;
    
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// Cargar navbar y footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadFooter();
});

