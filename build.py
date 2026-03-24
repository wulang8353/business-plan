#!/usr/bin/env python3
"""
HTML 模块构建脚本
将 modules 目录下的所有模块合并成单个主页.html文件
"""

import os
import sys

MODULES_DIR = os.path.join(os.path.dirname(__file__), 'modules')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), 'index.html')

# 模块加载顺序 - 按正确的HTML结构顺序
MODULE_ORDER = [
    'head.html',                    # HTML头部 + 所有CSS样式（包含<!DOCTYPE html>到</head>）
    'header.html',                  # 页面头部导航 + <body>开始 + <main>开始
    'basic-info.html',              # 基本信息区域
    'product-list.html',            # 商品清单区域（含动态tab）
    'resource-list.html',           # 资源列表区域 + </main>结束
    'modal-add.html',               # 添加商品弹窗
    'modal-edit.html',              # 编辑商品弹窗
    'modal-import.html',            # 导入商品弹窗
    'modal-batch.html',             # 批量编辑弹窗
    'modal-warning.html',           # 预警详情弹窗
    'modal-collab-history.html',    # 目标销量协同值历史变化弹窗
    'scripts.html',                 # JavaScript逻辑 + </body></html>
]

def build():
    print('🚀 开始构建主页.html...\n')
    
    output = ''
    success_count = 0
    fail_count = 0
    
    for module_name in MODULE_ORDER:
        module_path = os.path.join(MODULES_DIR, module_name)
        
        try:
            if os.path.exists(module_path):
                with open(module_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                output += content + '\n'
                print(f'✅ 已加载: {module_name}')
                success_count += 1
            else:
                print(f'⚠️  跳过: {module_name} (文件不存在)')
                fail_count += 1
        except Exception as e:
            print(f'❌ 错误: {module_name} - {e}')
            fail_count += 1
    
    # 写入输出文件
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f'\n✨ 构建完成!')
        print(f'📄 输出文件: {OUTPUT_FILE}')
        print(f'📊 成功: {success_count} | 跳过: {fail_count}')
        print(f'📦 总大小: {len(output) / 1024:.2f} KB')
    except Exception as e:
        print(f'\n❌ 写入失败: {e}')
        sys.exit(1)

if __name__ == '__main__':
    build()
