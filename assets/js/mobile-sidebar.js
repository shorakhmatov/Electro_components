/**
 * JavaScript u0434u043bu044f u0443u043fu0440u0430u0432u043bu0435u043du0438u044f u043cu043eu0431u0438u043bu044cu043du044bu043c u0431u043eu043au043eu0432u044bu043c u043cu0435u043du044e
 */
document.addEventListener('DOMContentLoaded', function() {
    // u042du043bu0435u043cu0435u043du0442u044b DOM
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebarClose = document.getElementById('mobileSidebarClose');
    
    // u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043eu0442u043au0440u044bu0442u0438u044f u043cu043eu0431u0438u043bu044cu043du043eu0433u043e u043cu0435u043du044e
    function openMobileSidebar() {
        if (mobileSidebar && mobileSidebarOverlay) {
            mobileSidebar.classList.add('active');
            mobileSidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // u0411u043bu043eu043au0438u0440u0443u0435u043c u043fu0440u043eu043au0440u0443u0442u043au0443 u0441u0442u0440u0430u043du0438u0446u044b
        }
    }
    
    // u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0437u0430u043au0440u044bu0442u0438u044f u043cu043eu0431u0438u043bu044cu043du043eu0433u043e u043cu0435u043du044e
    function closeMobileSidebar() {
        if (mobileSidebar && mobileSidebarOverlay) {
            mobileSidebar.classList.remove('active');
            mobileSidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // u0420u0430u0437u0431u043bu043eu043au0438u0440u0443u0435u043c u043fu0440u043eu043au0440u0443u0442u043au0443 u0441u0442u0440u0430u043du0438u0446u044b
        }
    }
    
    // u041eu0431u0440u0430u0431u043eu0442u0447u0438u043a u043au043bu0438u043au0430 u043fu043e u0431u0443u0440u0433u0435u0440-u043cu0435u043du044e
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            openMobileSidebar();
        });
    }
    
    // u041eu0431u0440u0430u0431u043eu0442u0447u0438u043a u043au043bu0438u043au0430 u043fu043e u043au043du043eu043fu043au0435 u0437u0430u043au0440u044bu0442u0438u044f
    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }
    
    // u041eu0431u0440u0430u0431u043eu0442u0447u0438u043a u043au043bu0438u043au0430 u043fu043e u043eu0432u0435u0440u043bu0435u044e
    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }
    
    // u0417u0430u043au0440u044bu0442u0438u0435 u043cu0435u043du044e u043fu0440u0438 u043au043bu0438u043au0435 u043fu043e u043fu0443u043du043au0442u0443 u043cu0435u043du044e
    const sidebarMenuItems = document.querySelectorAll('.mobile-sidebar-menu-item');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMobileSidebar();
        });
    });
    
    // u0417u0430u043au0440u044bu0442u0438u0435 u043cu0435u043du044e u043fu0440u0438 u0438u0437u043cu0435u043du0435u043du0438u0438 u0440u0430u0437u043cu0435u0440u0430 u044du043au0440u0430u043du0430
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMobileSidebar();
        }
    });
});
