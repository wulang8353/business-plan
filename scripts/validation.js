/**
 * 商品校验功能模块
 * 处理商品校验状态管理、全量校验、单商品重新校验等功能
 */

// 商品校验状态存储
const productValidationStatus = new Map();

// 初始化商品校验状态
function initProductValidationStatus() {
    // 从DOM中读取初始校验状态
    document.querySelectorAll('[data-product-id]').forEach(row => {
        const productId = row.dataset.productId;
        const badge = row.querySelector('.validation-badge');
        const timeEl = row.querySelector('.validation-time');

        if (badge && timeEl) {
            const isValidated = badge.classList.contains('validated');
            const timeText = timeEl.textContent.trim();
            let validationTime = null;

            if (isValidated && timeText) {
                validationTime = parseValidationTime(timeText);
            }

            productValidationStatus.set(productId, {
                status: isValidated ? 'validated' : 'pending',
                validationTime: validationTime,
                isValidating: false
            });
        }
    });
}

// 解析校验时间文本
function parseValidationTime(timeText) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (timeText.includes('今天')) {
        const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
            const [_, hours, minutes] = timeMatch;
            return new Date(today.getTime() + parseInt(hours) * 3600000 + parseInt(minutes) * 60000);
        }
    } else if (timeText.includes('昨天')) {
        const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
            const [_, hours, minutes] = timeMatch;
            const yesterday = new Date(today.getTime() - 86400000);
            return new Date(yesterday.getTime() + parseInt(hours) * 3600000 + parseInt(minutes) * 60000);
        }
    }

    return now;
}

// 格式化校验时间显示
function formatValidationTime(date) {
    if (!date) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today - dateDay) / 86400000);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (diffDays === 0) {
        return `今天 ${timeStr}`;
    } else if (diffDays === 1) {
        return `昨天 ${timeStr}`;
    } else {
        return `${diffDays}天前 ${timeStr}`;
    }
}

// 重新校验单个商品
function revalidateProduct(productId) {
    const status = productValidationStatus.get(productId);
    if (!status || status.isValidating) return;

    // 更新状态为校验中
    status.isValidating = true;
    updateProductValidationUI(productId, 'validating');

    // 模拟校验过程
    setTimeout(() => {
        status.status = 'validated';
        status.validationTime = new Date();
        status.isValidating = false;
        updateProductValidationUI(productId, 'validated');

        // 显示校验完成提示
        showNotification(`商品 ${productId} 校验完成`, 'success');
    }, 2000);
}

// 更新商品校验状态UI
function updateProductValidationUI(productId, forceStatus = null) {
    const status = productValidationStatus.get(productId);
    if (!status) return;

    const rows = document.querySelectorAll(`tr[data-product-id="${productId}"]`);
    const displayStatus = forceStatus || status.status;

    rows.forEach(row => {
        const badge = row.querySelector('.validation-badge');
        const timeEl = row.querySelector('.validation-time');

        if (badge) {
            badge.className = 'validation-badge ' + displayStatus;

            if (displayStatus === 'validating') {
                badge.innerHTML = '<span class="validating-icon">⟳</span> 校验中';
                badge.title = '正在校验...';
            } else if (displayStatus === 'validated') {
                badge.innerHTML = '✓ 已校验';
                badge.title = '点击重新校验';
            } else {
                badge.innerHTML = '○ 待校验';
                badge.title = '点击开始校验';
            }
        }

        if (timeEl && status.validationTime && displayStatus === 'validated') {
            timeEl.textContent = formatValidationTime(status.validationTime);
        }
    });
}

// 全量校验
function startFullValidation() {
    const progressContainer = document.getElementById('validation-progress');
    const progressFill = document.getElementById('validation-progress-fill');
    const statusEl = document.getElementById('validation-status');
    const timeEl = document.getElementById('validation-time');
    const validatedCountEl = document.getElementById('validated-count');
    const totalCountEl = document.getElementById('total-count');
    const abnormalCountEl = document.getElementById('abnormal-found-count');
    const validateBtn = document.getElementById('validate-all-btn');

    const productIds = Array.from(productValidationStatus.keys());
    const total = productIds.length;
    let validated = 0;
    let abnormalFound = 0;

    // 显示进度条
    progressContainer.style.display = 'block';
    validateBtn.disabled = true;
    totalCountEl.textContent = total;

    // 模拟分批校验
    const batchSize = 5;
    const batchInterval = 500;

    function validateBatch() {
        const batch = productIds.slice(validated, validated + batchSize);

        batch.forEach(productId => {
            const status = productValidationStatus.get(productId);
            status.status = 'validated';
            status.validationTime = new Date();
            updateProductValidationUI(productId);

            // 模拟发现异常
            if (Math.random() < 0.15) {
                abnormalFound++;
            }
        });

        validated += batch.length;
        const progress = (validated / total) * 100;

        progressFill.style.width = progress + '%';
        validatedCountEl.textContent = validated;
        abnormalCountEl.textContent = abnormalFound;
        timeEl.textContent = `预计剩余时间：${Math.ceil((total - validated) / batchSize * batchInterval / 1000)}秒`;

        if (validated < total) {
            setTimeout(validateBatch, batchInterval);
        } else {
            // 校验完成
            statusEl.textContent = '校验完成！';
            timeEl.textContent = '';
            validateBtn.disabled = false;

            // 显示结果通知
            showValidationResult(total, abnormalFound);

            // 3秒后隐藏进度条
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 3000);
        }
    }

    validateBatch();
}

// 显示校验结果通知
function showValidationResult(total, abnormal) {
    const toast = document.getElementById('validation-toast');
    const message = document.getElementById('toast-message');

    if (toast && message) {
        message.textContent = `校验完成！共校验${total}件商品，发现${abnormal}件异常商品`;
        toast.style.display = 'flex';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    }
}

function hideValidationToast() {
    const toast = document.getElementById('validation-toast');
    if (toast) {
        toast.style.display = 'none';
    }
}

// 通知提示
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#f6ffed' : type === 'error' ? '#fff1f0' : '#e6f7ff'};
        border: 1px solid ${type === 'success' ? '#b7eb8f' : type === 'error' ? '#ffa39e' : '#91d5ff'};
        color: ${type === 'success' ? '#52c41a' : type === 'error' ? '#ff4d4f' : '#1890ff'};
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 定时更新校验时间显示
setInterval(() => {
    productValidationStatus.forEach((status, productId) => {
        if (status.status === 'validated' && !status.isValidating) {
            updateProductValidationUI(productId);
        }
    });
}, 60000);

// 导出函数
window.initProductValidationStatus = initProductValidationStatus;
window.revalidateProduct = revalidateProduct;
window.startFullValidation = startFullValidation;
window.hideValidationToast = hideValidationToast;
window.showNotification = showNotification;
