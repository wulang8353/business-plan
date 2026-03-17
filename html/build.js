#!/usr/bin/env node

/**
 * HTML 模块构建脚本
 * 将 modules 目录下的所有模块合并成单个主页.html文件
 */

const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.join(__dirname, 'modules');
const OUTPUT_FILE = path.join(__dirname, '主页.html');

// 模块加载顺序
const MODULE_ORDER = [
    'head.html',                    // HTML头部和基础样式
    'basic-info-styles.html',       // 基本信息区域样式
    'product-list-styles.html',     // 商品清单区域样式
    'resource-list-styles.html',    // 资源列表区域样式
    'modal-add-styles.html',        // 添加商品弹窗样式
    'modal-edit-styles.html',       // 编辑商品弹窗样式
    'modal-import-styles.html',     // 导入商品弹窗样式
    'modal-batch-styles.html',      // 批量编辑弹窗样式
    'modal-warning-styles.html',    // 预警详情弹窗样式
    'header.html',                  // 页面头部
    'basic-info.html',              // 基本信息区域
    'product-list.html',            // 商品清单区域
    'resource-list.html',           // 资源列表区域
    'modal-add.html',               // 添加商品弹窗
    'modal-edit.html',              // 编辑商品弹窗
    'modal-import.html',            // 导入商品弹窗
    'modal-batch.html',             // 批量编辑弹窗
    'modal-warning.html',           // 预警详情弹窗
    'scripts.html',                 // JavaScript逻辑
];

function build() {
    console.log('🚀 开始构建主页.html...\n');
    
    let output = '';
    let successCount = 0;
    let failCount = 0;
    
    for (const moduleName of MODULE_ORDER) {
        const modulePath = path.join(MODULES_DIR, moduleName);
        
        try {
            if (fs.existsSync(modulePath)) {
                const content = fs.readFileSync(modulePath, 'utf-8');
                output += content + '\n';
                console.log(`✅ 已加载: ${moduleName}`);
                successCount++;
            } else {
                console.warn(`⚠️  跳过: ${moduleName} (文件不存在)`);
                failCount++;
            }
        } catch (error) {
            console.error(`❌ 错误: ${moduleName} - ${error.message}`);
            failCount++;
        }
    }
    
    // 写入输出文件
    try {
        fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
        console.log(`\n✨ 构建完成!`);
        console.log(`📄 输出文件: ${OUTPUT_FILE}`);
        console.log(`📊 成功: ${successCount} | 跳过: ${failCount}`);
        console.log(`📦 总大小: ${(output.length / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error(`\n❌ 写入失败: ${error.message}`);
        process.exit(1);
    }
}

// 监听模式
function watch() {
    console.log('👀 启动监听模式...\n');
    
    build();
    
    fs.watch(MODULES_DIR, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.html')) {
            console.log(`\n📝 文件变更: ${filename}`);
            console.log('🔄 重新构建...\n');
            build();
        }
    });
    
    console.log('\n⏳ 正在监听 modules 目录的变更...');
    console.log('按 Ctrl+C 停止监听');
}

// 主入口
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
    watch();
} else {
    build();
}
