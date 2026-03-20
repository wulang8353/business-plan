/**
 * 供应链备货进度模块
 * 处理数据表格维度切换、排序、筛选、导出等功能
 */

// 数据表格状态
let supplyTableState = {
    currentDimension: 'warehouse',
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
    sortField: null,
    sortOrder: null,
    filters: {
        name: '',
        city: '',
        province: ''
    },
    filteredData: [],
    rawData: []
};

// 原始仓库数据
const warehouseRawData = [
    { id: 'WH001', name: '北京朝阳仓', city: '北京市', province: '北京市', currentStock: 8500, orderQty: 12000, warehouseQty: 9800, inTransit: 2200, delivery7d: 1850, salesAvg7d: 264.3 },
    { id: 'WH002', name: '北京通州仓', city: '北京市', province: '北京市', currentStock: 6200, orderQty: 8000, warehouseQty: 7500, inTransit: 1500, delivery7d: 1200, salesAvg7d: 171.4 },
    { id: 'WH003', name: '上海浦东仓', city: '上海市', province: '上海市', currentStock: 9200, orderQty: 15000, warehouseQty: 11000, inTransit: 2800, delivery7d: 2100, salesAvg7d: 300.0 },
    { id: 'WH004', name: '上海青浦仓', city: '上海市', province: '上海市', currentStock: 7800, orderQty: 10000, warehouseQty: 9200, inTransit: 1800, delivery7d: 1650, salesAvg7d: 235.7 },
    { id: 'WH005', name: '广州天河仓', city: '广州市', province: '广东省', currentStock: 10500, orderQty: 18000, warehouseQty: 12500, inTransit: 3500, delivery7d: 2400, salesAvg7d: 342.9 },
    { id: 'WH006', name: '深圳南山仓', city: '深圳市', province: '广东省', currentStock: 9800, orderQty: 16000, warehouseQty: 11500, inTransit: 3200, delivery7d: 2250, salesAvg7d: 321.4 },
    { id: 'WH007', name: '杭州西湖仓', city: '杭州市', province: '浙江省', currentStock: 7200, orderQty: 9000, warehouseQty: 8500, inTransit: 1600, delivery7d: 1400, salesAvg7d: 200.0 },
    { id: 'WH008', name: '南京鼓楼仓', city: '南京市', province: '江苏省', currentStock: 6800, orderQty: 8500, warehouseQty: 7800, inTransit: 1400, delivery7d: 1300, salesAvg7d: 185.7 },
    { id: 'WH009', name: '成都锦江仓', city: '成都市', province: '四川省', currentStock: 8900, orderQty: 11000, warehouseQty: 10200, inTransit: 2100, delivery7d: 1750, salesAvg7d: 250.0 },
    { id: 'WH010', name: '武汉江汉仓', city: '武汉市', province: '湖北省', currentStock: 7500, orderQty: 9500, warehouseQty: 8800, inTransit: 1700, delivery7d: 1450, salesAvg7d: 207.1 },
    { id: 'WH011', name: '西安雁塔仓', city: '西安市', province: '陕西省', currentStock: 6500, orderQty: 8000, warehouseQty: 7500, inTransit: 1300, delivery7d: 1200, salesAvg7d: 171.4 },
    { id: 'WH012', name: '重庆渝中仓', city: '重庆市', province: '重庆市', currentStock: 8200, orderQty: 10500, warehouseQty: 9500, inTransit: 1900, delivery7d: 1600, salesAvg7d: 228.6 },
    { id: 'WH013', name: '天津和平仓', city: '天津市', province: '天津市', currentStock: 5800, orderQty: 7000, warehouseQty: 6500, inTransit: 1100, delivery7d: 1000, salesAvg7d: 142.9 },
    { id: 'WH014', name: '苏州工业园仓', city: '苏州市', province: '江苏省', currentStock: 7100, orderQty: 8800, warehouseQty: 8200, inTransit: 1500, delivery7d: 1350, salesAvg7d: 192.9 },
    { id: 'WH015', name: '青岛崂山仓', city: '青岛市', province: '山东省', currentStock: 6300, orderQty: 7800, warehouseQty: 7200, inTransit: 1200, delivery7d: 1150, salesAvg7d: 164.3 },
    { id: 'WH016', name: '厦门思明仓', city: '厦门市', province: '福建省', currentStock: 5400, orderQty: 6500, warehouseQty: 6000, inTransit: 900, delivery7d: 950, salesAvg7d: 135.7 },
    { id: 'WH017', name: '长沙岳麓仓', city: '长沙市', province: '湖南省', currentStock: 6900, orderQty: 8500, warehouseQty: 7800, inTransit: 1400, delivery7d: 1250, salesAvg7d: 178.6 },
    { id: 'WH018', name: '郑州金水仓', city: '郑州市', province: '河南省', currentStock: 6100, orderQty: 7500, warehouseQty: 7000, inTransit: 1100, delivery7d: 1100, salesAvg7d: 157.1 },
    { id: 'WH019', name: '沈阳和平仓', city: '沈阳市', province: '辽宁省', currentStock: 5200, orderQty: 6200, warehouseQty: 5800, inTransit: 850, delivery7d: 900, salesAvg7d: 128.6 },
    { id: 'WH020', name: '大连中山仓', city: '大连市', province: '辽宁省', currentStock: 4800, orderQty: 5800, warehouseQty: 5400, inTransit: 750, delivery7d: 820, salesAvg7d: 117.1 },
    { id: 'WH021', name: '宁波鄞州仓', city: '宁波市', province: '浙江省', currentStock: 5900, orderQty: 7200, warehouseQty: 6700, inTransit: 1050, delivery7d: 1050, salesAvg7d: 150.0 },
    { id: 'WH022', name: '佛山禅城仓', city: '佛山市', province: '广东省', currentStock: 6700, orderQty: 8200, warehouseQty: 7600, inTransit: 1300, delivery7d: 1200, salesAvg7d: 171.4 },
    { id: 'WH023', name: '东莞南城仓', city: '东莞市', province: '广东省', currentStock: 7200, orderQty: 8800, warehouseQty: 8200, inTransit: 1500, delivery7d: 1350, salesAvg7d: 192.9 },
    { id: 'WH024', name: '无锡梁溪仓', city: '无锡市', province: '江苏省', currentStock: 5600, orderQty: 6800, warehouseQty: 6300, inTransit: 950, delivery7d: 980, salesAvg7d: 140.0 }
];

// 聚合数据到城市维度
function aggregateToCity(data) {
    const cityMap = new Map();

    data.forEach(item => {
        const key = item.city;
        if (!cityMap.has(key)) {
            cityMap.set(key, {
                id: 'CITY_' + key,
                name: key,
                city: key,
                province: item.province,
                currentStock: 0,
                orderQty: 0,
                warehouseQty: 0,
                inTransit: 0,
                delivery7d: 0,
                salesAvg7d: 0,
                warehouseCount: 0
            });
        }

        const city = cityMap.get(key);
        city.currentStock += item.currentStock;
        city.orderQty += item.orderQty;
        city.warehouseQty += item.warehouseQty;
        city.inTransit += item.inTransit;
        city.delivery7d += item.delivery7d;
        city.salesAvg7d += item.salesAvg7d;
        city.warehouseCount++;
    });

    return Array.from(cityMap.values());
}

// 聚合数据到省份维度
function aggregateToProvince(data) {
    const provinceMap = new Map();

    data.forEach(item => {
        const key = item.province;
        if (!provinceMap.has(key)) {
            provinceMap.set(key, {
                id: 'PROV_' + key,
                name: key,
                city: '-',
                province: key,
                currentStock: 0,
                orderQty: 0,
                warehouseQty: 0,
                inTransit: 0,
                delivery7d: 0,
                salesAvg7d: 0,
                warehouseCount: 0,
                cityCount: 0
            });
        }

        const province = provinceMap.get(key);
        province.currentStock += item.currentStock;
        province.orderQty += item.orderQty;
        province.warehouseQty += item.warehouseQty;
        province.inTransit += item.inTransit;
        province.delivery7d += item.delivery7d;
        province.salesAvg7d += item.salesAvg7d;
        province.warehouseCount += item.warehouseCount || 1;
    });

    return Array.from(provinceMap.values());
}

// 切换数据维度
function switchDataDimension(dimension) {
    supplyTableState.currentDimension = dimension;
    supplyTableState.currentPage = 1;
    supplyTableState.sortField = null;
    supplyTableState.sortOrder = null;

    // 更新维度标签
    document.querySelectorAll('.dimension-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.dimension === dimension);
    });

    // 更新维度徽章
    const dimensionNames = {
        warehouse: '仓维度视图',
        city: '城市维度视图',
        province: '省份维度视图'
    };
    document.getElementById('current-dimension-badge').textContent = dimensionNames[dimension];

    // 加载数据
    loadSupplyTableData();

    // 添加切换动画
    const tableContainer = document.querySelector('.supply-table-container');
    tableContainer.style.opacity = '0.5';
    setTimeout(() => {
        tableContainer.style.opacity = '1';
    }, 200);
}

// 加载数据表格数据
function loadSupplyTableData() {
    let data;
    switch (supplyTableState.currentDimension) {
        case 'city':
            data = aggregateToCity(warehouseRawData);
            break;
        case 'province':
            data = aggregateToProvince(warehouseRawData);
            break;
        default:
            data = [...warehouseRawData];
    }

    supplyTableState.rawData = data;
    applySupplyTableFilters();
}

// 应用筛选
function applySupplyTableFilters() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();
    const cityFilter = document.getElementById('filter-city').value;
    const provinceFilter = document.getElementById('filter-province').value;

    supplyTableState.filters = {
        name: nameFilter,
        city: cityFilter,
        province: provinceFilter
    };

    let filtered = supplyTableState.rawData.filter(item => {
        const matchName = !nameFilter ||
            item.name.toLowerCase().includes(nameFilter) ||
            item.city.toLowerCase().includes(nameFilter) ||
            item.province.toLowerCase().includes(nameFilter);
        const matchCity = !cityFilter || item.city === cityFilter;
        const matchProvince = !provinceFilter || item.province === provinceFilter;

        return matchName && matchCity && matchProvince;
    });

    // 应用排序
    if (supplyTableState.sortField && supplyTableState.sortOrder) {
        filtered.sort((a, b) => {
            let valA = a[supplyTableState.sortField];
            let valB = b[supplyTableState.sortField];

            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (supplyTableState.sortOrder === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    }

    supplyTableState.filteredData = filtered;
    supplyTableState.totalItems = filtered.length;
    supplyTableState.totalPages = Math.ceil(filtered.length / supplyTableState.pageSize);

    renderSupplyTable();
    renderSupplyPagination();
}

// 重置筛选
function resetSupplyTableFilters() {
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-city').value = '';
    document.getElementById('filter-province').value = '';
    applySupplyTableFilters();
}

// 排序
function sortSupplyTable(field) {
    if (supplyTableState.sortField === field) {
        supplyTableState.sortOrder = supplyTableState.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        supplyTableState.sortField = field;
        supplyTableState.sortOrder = 'asc';
    }

    applySupplyTableFilters();
}

// 渲染数据表格
function renderSupplyTable() {
    const tbody = document.querySelector('#supply-data-table tbody');
    const startIndex = (supplyTableState.currentPage - 1) * supplyTableState.pageSize;
    const endIndex = Math.min(startIndex + supplyTableState.pageSize, supplyTableState.filteredData.length);
    const pageData = supplyTableState.filteredData.slice(startIndex, endIndex);

    const dimensionTags = {
        warehouse: '<span class="dimension-tag warehouse">仓</span>',
        city: '<span class="dimension-tag city">城</span>',
        province: '<span class="dimension-tag province">省</span>'
    };

    tbody.innerHTML = pageData.map(item => `
        <tr>
            <td>${dimensionTags[supplyTableState.currentDimension]} ${item.name}</td>
            <td>${item.city}</td>
            <td class="number">${item.currentStock.toLocaleString()}</td>
            <td class="number">${item.orderQty.toLocaleString()}</td>
            <td class="number">${item.warehouseQty.toLocaleString()}</td>
            <td class="number">${item.inTransit.toLocaleString()}</td>
            <td class="number">${item.delivery7d.toLocaleString()}</td>
            <td class="number">${item.salesAvg7d.toFixed(1)}</td>
        </tr>
    `).join('');

    // 更新排序图标
    document.querySelectorAll('#supply-data-table th.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === supplyTableState.sortField) {
            th.classList.add(supplyTableState.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });
}

// 渲染分页
function renderSupplyPagination() {
    const totalEl = document.getElementById('supply-total-count');
    const pageInfoEl = document.getElementById('supply-page-info');
    const pagesContainer = document.getElementById('supply-page-numbers');

    if (totalEl) totalEl.textContent = supplyTableState.totalItems;
    if (pageInfoEl) pageInfoEl.textContent = `${supplyTableState.currentPage} / ${supplyTableState.totalPages}`;

    if (!pagesContainer) return;

    let html = '';
    const currentPage = supplyTableState.currentPage;
    const totalPages = supplyTableState.totalPages;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToSupplyPage(${i})">${i}</button>`;
    }

    pagesContainer.innerHTML = html;
}

// 跳转到指定页
function goToSupplyPage(page) {
    if (page < 1 || page > supplyTableState.totalPages) return;
    supplyTableState.currentPage = page;
    renderSupplyTable();
    renderSupplyPagination();
}

// 改变每页显示数量
function changeSupplyPageSize(size) {
    supplyTableState.pageSize = parseInt(size);
    supplyTableState.currentPage = 1;
    supplyTableState.totalPages = Math.ceil(supplyTableState.filteredData.length / supplyTableState.pageSize);
    renderSupplyTable();
    renderSupplyPagination();
}

// 导出数据
function exportSupplyTableData() {
    const dimensionNames = {
        warehouse: '仓维度',
        city: '城市维度',
        province: '省份维度'
    };

    const headers = ['名称', '城市', '当前库存', '采购下单数', '实际到仓', '在途数量', '近7天出库件数', '近7天店均销售'];
    const data = supplyTableState.filteredData.map(item => [
        item.name,
        item.city,
        item.currentStock,
        item.orderQty,
        item.warehouseQty,
        item.inTransit,
        item.delivery7d,
        item.salesAvg7d.toFixed(1)
    ]);

    const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `供应链数据_${dimensionNames[supplyTableState.currentDimension]}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    showNotification('数据导出成功', 'success');
}

// 初始化筛选选项
function initSupplyTableFilters() {
    const citySelect = document.getElementById('filter-city');
    const provinceSelect = document.getElementById('filter-province');

    const cities = [...new Set(warehouseRawData.map(item => item.city))].sort();
    const provinces = [...new Set(warehouseRawData.map(item => item.province))].sort();

    if (citySelect) {
        citySelect.innerHTML = '<option value="">全部城市</option>' +
            cities.map(city => `<option value="${city}">${city}</option>`).join('');
    }

    if (provinceSelect) {
        provinceSelect.innerHTML = '<option value="">全部省份</option>' +
            provinces.map(province => `<option value="${province}">${province}</option>`).join('');
    }
}

// 导出函数
window.switchDataDimension = switchDataDimension;
window.applySupplyTableFilters = applySupplyTableFilters;
window.resetSupplyTableFilters = resetSupplyTableFilters;
window.sortSupplyTable = sortSupplyTable;
window.goToSupplyPage = goToSupplyPage;
window.changeSupplyPageSize = changeSupplyPageSize;
window.exportSupplyTableData = exportSupplyTableData;
window.initSupplyTableFilters = initSupplyTableFilters;
