# PRD 文档索引

本目录存放产品需求文档（Product Requirements Document），按项目/活动组织。

***

## 文档列表

| 文档                         | 项目/活动 | 说明         | 状态     |
| -------------------------- | ----- | ---------- | ------ |
| [生意计划-PRD.md](生意计划-PRD.md) | 生意计划  | 生意计划产品需求文档 | 📝 待创建 |

***

## 图片素材

若 PRD 中包含流程图、架构图等，统一放在 `project/assets/` 目录下：

| 图片 | 说明 | 引用文档 |
| -- | -- | ---- |
| -  | -  | -    |

***

## 使用提示（给 AI）

- 评审 PRD 前先说：「先看 `glossary/README.md` 和 `glossary/glossary.md`，再评审 `prd/xxx-PRD.md`」
- 若 PRD 中有流程图：「结合 `prd/assets/xxx.png` 理解 `prd/xxx-PRD.md` 中的流程」

***

## 新建 PRD 流程

1. 复制 `templates/prd-template.md` 到本目录，命名为 `YYYY-MM-项目名称.md`
2. 填写背景、目标、方案等内容
3. 如有流程图，导出为 PNG 放入 `assets/` 目录
4. 更新本 README 的「文档列表」表格
5. `git add` + `commit` + `push`

