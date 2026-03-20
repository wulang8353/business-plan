// 预警详情分析面板 - 左侧菜单模块 JavaScript

/**
 * 切换预警详情 Tab
 * @param {string} tab - 要切换到的 tab 名称 (plan/coverage/supply)
 */
function switchWarningTab(tab) {
    // 更新菜单激活状态
    document.querySelectorAll('.warning-menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.warning-menu-item[data-warning-tab="${tab}"]`).classList.add('active');
    
    // 隐藏所有内容
    const contentIds = ['warning-plan-content', 'warning-coverage-content', 'warning-supply-content'];
    contentIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // 显示对应内容
    const contentMap = {
        'plan': 'warning-plan-content',
        'coverage': 'warning-coverage-content',
        'supply': 'warning-supply-content'
    };
    
    const targetId = contentMap[tab];
    if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.style.display = 'block';
    }
    
    // 触发 tab 切换事件，供其他模块监听
    window.dispatchEvent(new CustomEvent('warningTabChanged', { 
        detail: { tab: tab, timestamp: Date.now() } 
    }));
}

/**
 * 更新菜单徽章数字
 * @param {string} tab - tab 名称
 * @param {number} count - 徽章数字
 */
function updateWarningBadge(tab, count) {
    const badgeId = `badge-${tab}`;
    const badge = document.getElementById(badgeId);
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

/**
 * 获取当前激活的 Tab
 * @returns {string|null} 当前激活的 tab 名称
 */
function getActiveWarningTab() {
    const activeItem = document.querySelector('.warning-menu-item.active');
    return activeItem ? activeItem.dataset.warningTab : null;
}

/**
 * 初始化左侧菜单模块
 */
function initWarningSidebar() {
    // 确保默认选中第一个 tab
    const firstTab = document.querySelector('.warning-menu-item');
    if (firstTab && !document.querySelector('.warning-menu-item.active')) {
        firstTab.classList.add('active');
    }
}

// 导出模块接口（如果使用模块化系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchWarningTab,
        updateWarningBadge,
        getActiveWarningTab,
        initWarningSidebar
    };
}
