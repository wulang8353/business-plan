/**
 * 主入口脚本 - 生意计划项目
 * 负责初始化页面和加载各模块
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initProductValidationStatus();
    initPagination();
    initTabs();
    initModals();
});

// 导航功能
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.dataset.section;
            switchTab(section);
        });
    });
}

function switchTab(section) {
    // 更新导航状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.section === section);
    });

    // 滚动到对应区域
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Tab切换功能
function initTabs() {
    // 资源列表Tab
    const resourceTabs = document.querySelectorAll('.resource-tab');
    resourceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const resource = this.dataset.resource;
            switchResourceTab(resource);
        });
    });
}

function switchResourceTab(resource) {
    // 更新Tab状态
    document.querySelectorAll('.resource-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.resource === resource);
    });

    // 显示对应表格
    document.getElementById('promotion-table').style.display = resource === 'promotion' ? 'block' : 'none';
    document.getElementById('position-table').style.display = resource === 'position' ? 'block' : 'none';
}

// 弹窗功能
function initModals() {
    // 点击遮罩关闭弹窗
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                const modalId = this.id.replace('modal-', '');
                closeModal(modalId);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById('modal-' + modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById('modal-' + modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 商品列表Tab切换
function switchProductTab(tab) {
    // 更新统计项状态
    document.querySelectorAll('.stats-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
    });

    // 显示/隐藏对应表格
    const addedTable = document.getElementById('added-products-table');
    const abnormalTable = document.getElementById('abnormal-products-table');

    if (tab === 'added') {
        addedTable.style.display = 'block';
        abnormalTable.style.display = 'none';
    } else {
        addedTable.style.display = 'none';
        abnormalTable.style.display = 'block';
    }
}

// 抽屉功能
function openWarningDrawer() {
    const drawer = document.getElementById('drawer-warning-detail');
    if (drawer) {
        drawer.classList.add('active');
        document.body.classList.add('drawer-open');
    }
}

function closeWarningDrawer() {
    const drawer = document.getElementById('drawer-warning-detail');
    if (drawer) {
        drawer.classList.remove('active');
        document.body.classList.remove('drawer-open');
    }
}

// 导出函数供其他模块使用
window.openModal = openModal;
window.closeModal = closeModal;
window.switchProductTab = switchProductTab;
window.openWarningDrawer = openWarningDrawer;
window.closeWarningDrawer = closeWarningDrawer;
