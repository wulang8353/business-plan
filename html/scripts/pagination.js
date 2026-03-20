/**
 * 分页功能模块
 * 处理表格分页、数据分页显示等功能
 */

// 分页状态
const paginationState = {
    addedProducts: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1
    },
    abnormalProducts: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1
    }
};

// 初始化分页
function initPagination() {
    // 初始化已添加商品分页
    initTablePagination('added');
    // 初始化异常商品分页
    initTablePagination('abnormal');
}

// 初始化表格分页
function initTablePagination(tableType) {
    const tableId = tableType === 'added' ? 'added-products-table' : 'abnormal-products-table';
    const tbodyId = tableType === 'added' ? 'added-products-tbody' : 'abnormal-products-tbody';
    const paginationId = tableType === 'added' ? 'added-products-pagination' : 'abnormal-products-pagination';

    const tbody = document.getElementById(tbodyId);
    const pagination = document.getElementById(paginationId);

    if (!tbody || !pagination) return;

    const rows = tbody.querySelectorAll('tr');
    const totalItems = rows.length;
    const state = paginationState[tableType + 'Products'];

    state.totalItems = totalItems;
    state.totalPages = Math.ceil(totalItems / state.pageSize);

    // 如果数据不足10条，隐藏分页器
    if (totalItems <= 10) {
        pagination.classList.add('hidden');
        return;
    }

    // 显示第一页数据
    updateTablePage(tableType, 1);

    // 渲染分页控件
    renderPagination(tableType);
}

// 更新表格显示页
function updateTablePage(tableType, page) {
    const tbodyId = tableType === 'added' ? 'added-products-tbody' : 'abnormal-products-tbody';
    const tbody = document.getElementById(tbodyId);

    if (!tbody) return;

    const state = paginationState[tableType + 'Products'];
    const rows = tbody.querySelectorAll('tr');

    state.currentPage = page;

    const startIndex = (page - 1) * state.pageSize;
    const endIndex = Math.min(startIndex + state.pageSize, rows.length);

    rows.forEach((row, index) => {
        row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
    });

    // 更新分页控件状态
    updatePaginationUI(tableType);
}

// 渲染分页控件
function renderPagination(tableType) {
    const paginationId = tableType === 'added' ? 'added-products-pagination' : 'abnormal-products-pagination';
    const pagination = document.getElementById(paginationId);

    if (!pagination) return;

    const state = paginationState[tableType + 'Products'];

    pagination.innerHTML = `
        <div class="pagination-info">
            共 <strong>${state.totalItems}</strong> 条记录
            <span class="pagination-divider">|</span>
            第 <strong>${state.currentPage}</strong> / <strong>${state.totalPages}</strong> 页
        </div>
        <div class="pagination-controls">
            <button class="pagination-btn" onclick="goToPage('${tableType}', 1)" title="首页">
                <span class="pagination-icon">«</span>
            </button>
            <button class="pagination-btn" onclick="goToPage('${tableType}', ${state.currentPage - 1})" title="上一页">
                <span class="pagination-icon">‹</span>
            </button>
            <div class="pagination-pages" id="${tableType}-page-numbers"></div>
            <button class="pagination-btn" onclick="goToPage('${tableType}', ${state.currentPage + 1})" title="下一页">
                <span class="pagination-icon">›</span>
            </button>
            <button class="pagination-btn" onclick="goToPage('${tableType}', ${state.totalPages})" title="末页">
                <span class="pagination-icon">»</span>
            </button>
        </div>
        <div class="pagination-jump">
            <span>跳至</span>
            <input type="number" class="pagination-input" id="${tableType}-jump-input" min="1" max="${state.totalPages}" onkeypress="handleJumpKeypress(event, '${tableType}')">
            <span>页</span>
            <button class="pagination-btn pagination-jump-btn" onclick="jumpToPage('${tableType}')">确定</button>
        </div>
    `;

    renderPageNumbers(tableType);
}

// 渲染页码按钮
function renderPageNumbers(tableType) {
    const state = paginationState[tableType + 'Products'];
    const containerId = tableType + '-page-numbers';
    const container = document.getElementById(containerId);

    if (!container) return;

    let html = '';
    const currentPage = state.currentPage;
    const totalPages = state.totalPages;

    // 简化显示：最多显示5个页码
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage('${tableType}', ${i})">${i}</button>`;
    }

    container.innerHTML = html;
}

// 更新分页UI状态
function updatePaginationUI(tableType) {
    const state = paginationState[tableType + 'Products'];

    // 更新页码按钮
    renderPageNumbers(tableType);

    // 更新上一页/下一页按钮状态
    const paginationId = tableType === 'added' ? 'added-products-pagination' : 'abnormal-products-pagination';
    const pagination = document.getElementById(paginationId);

    if (pagination) {
        const prevBtn = pagination.querySelector('.pagination-btn:nth-child(2)');
        const nextBtn = pagination.querySelector('.pagination-btn:nth-child(4)');

        if (prevBtn) {
            prevBtn.disabled = state.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = state.currentPage === state.totalPages;
        }
    }

    // 更新信息文本
    const infoEl = pagination.querySelector('.pagination-info');
    if (infoEl) {
        infoEl.innerHTML = `
            共 <strong>${state.totalItems}</strong> 条记录
            <span class="pagination-divider">|</span>
            第 <strong>${state.currentPage}</strong> / <strong>${state.totalPages}</strong> 页
        `;
    }
}

// 跳转到指定页
function goToPage(tableType, page) {
    const state = paginationState[tableType + 'Products'];

    if (page < 1 || page > state.totalPages || page === state.currentPage) {
        return;
    }

    updateTablePage(tableType, page);
}

// 跳转输入框回车处理
function handleJumpKeypress(event, tableType) {
    if (event.key === 'Enter') {
        jumpToPage(tableType);
    }
}

// 跳转到输入的页码
function jumpToPage(tableType) {
    const inputId = tableType + '-jump-input';
    const input = document.getElementById(inputId);

    if (!input) return;

    const page = parseInt(input.value);
    const state = paginationState[tableType + 'Products'];

    if (page && page >= 1 && page <= state.totalPages) {
        goToPage(tableType, page);
        input.value = '';
    } else {
        input.value = '';
        showNotification('请输入有效的页码', 'error');
    }
}

// 导出函数
window.initPagination = initPagination;
window.goToPage = goToPage;
window.jumpToPage = jumpToPage;
window.handleJumpKeypress = handleJumpKeypress;
