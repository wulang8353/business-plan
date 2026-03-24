#!/usr/bin/env python3
"""
优化的 HTML 模块构建脚本
支持将完整的 index.html 拆分为模块，或从模块构建 index.html
"""

import os
import sys
import shutil

MODULES_DIR = os.path.join(os.path.dirname(__file__), 'modules')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), 'index.html')
BACKUP_FILE = os.path.join(os.path.dirname(__file__), 'index.html.backup')

# 模块加载顺序
MODULE_ORDER = [
    'head.html',
    'header.html',
    'basic-info.html',
    'product-list.html',
    'resource-list.html',
    'modal-add.html',
    'modal-edit.html',
    'modal-import.html',
    'modal-batch.html',
    'modal-collab-history.html',
    'scripts.html',
]

def backup_index():
    """备份当前的 index.html"""
    if os.path.exists(OUTPUT_FILE):
        shutil.copy2(OUTPUT_FILE, BACKUP_FILE)
        print(f'✅ 已备份: {OUTPUT_FILE} -> {BACKUP_FILE}')

def build_from_modules():
    """从模块构建 index.html"""
    print('🚀 开始从模块构建 index.html...\n')
    
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

def split_to_modules():
    """将 index.html 拆分为模块（高级功能）"""
    print('⚠️  此功能需要手动拆分 index.html')
    print('💡 建议:')
    print('   1. 备份当前 index.html（已自动完成）')
    print('   2. 手动将 index.html 内容拆分到 modules/ 目录')
    print('   3. 使用 build_from_modules() 重新构建')

def main():
    print('=' * 60)
    print('生意计划 - 优化构建工具')
    print('=' * 60)
    
    # 先备份
    backup_index()
    
    print('\n请选择操作:')
    print('1. 从模块构建 index.html')
    print('2. 查看帮助')
    
    choice = input('\n请输入选项 (1-2): ').strip()
    
    if choice == '1':
        build_from_modules()
    else:
        print('\n📖 使用说明:')
        print('- 当前推荐直接编辑 index.html（已完整备份）')
        print('- 如需模块化，请手动拆分到 modules/ 目录')
        print('- 然后运行: python3 build_optimized.py')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n👋 已取消操作')
        sys.exit(0)
