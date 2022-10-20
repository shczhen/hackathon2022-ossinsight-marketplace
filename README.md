# [RFC] OSSInsight Marketplace

## 团队信息

- 团队名称：***自己写 自己查 自己网站上挂***
- 作者：王琦智([Icemap](https://github.com/Icemap))、陈臻([shczhen](https://github.com/shczhen))、梁志远([Mini256](https://github.com/Mini256))

## 项目介绍

本小队计划在 Hackathon 2022 中完成 [OSSInsight](https://ossinsight.io/) 的 Marketplace 模块。用户可自由上传自己编写的组件，通过审核后，其他用户可使用此组件，并可将组件嵌入到任意页面中（iframe 方式）。

![business-flow](https://user-images.githubusercontent.com/26212551/192482595-3f3d4041-8922-433e-9a73-1267002307a7.png)


组件由两部分组成：

- SQL：用于查出需求数据（仅支持 SELECT 语句）。
- 显示 Option 构建函数：提供 JS 函数，入参包含上一步 SQL 的查询结果，出参为用于构建 [Apache ECharts](https://echarts.apache.org/zh/index.html) 显示的 Option 对象。

![data-flow](https://user-images.githubusercontent.com/26212551/192477367-256606c7-f8ea-4302-a7fc-2f17dd89797c.png)

## 背景&动机

[OSSInsight](https://ossinsight.io/) 为 [PingCAP](https://www.pingcap.com/) 社区团队为展现 TiDB 能力完成的一个对开源项目进行洞察的分析项目，但其仍缺少可定制能力。我们希望使用通过 OSSInsight Marketplace 项目来借助开源力量完成 OSSInsight 功能的进一步提升。

## 项目设计

### 基础依赖

- [OSSInsight](https://ossinsight.io/)
- [TiDB 开发者手册](https://docs.pingcap.com/zh/tidb/stable/dev-guide-overview)
- [TiDB Cloud](https://www.pingcap.com/tidb-cloud/)
- [Apache ECharts](https://echarts.apache.org/zh/index.html)

### 实现设计

#### 1. 组件上传功能

**前端**

- SQL 填写入口
- JS 填写入口
- [可选]：易用性提升，组件成果预览
- [可选]：易用性提升，为常用 Option 构建提供 UI。

**后端**

- 组件保存

#### 2. 组件审核功能

**前端**

- 审核列表展示
- 审核操作

**后端**

- 审核列表
- 审核操作

#### 3. 数据准备

**后端**

- 依照刷新时间完成数据缓存与刷新（也可以是实时）
- 在 SQL 前后加插控制逻辑，如超时、内存控制等

#### 4. 数据展示

**前端**

- 读取该组件 SQL 运行结果数据
- 将此数据转为一二维 array 对象，使用此数据调用组件 JS 函数
- 使用 JS 函数得到的 option 对 ECharts 组件进行渲染

**后端**

- 传输 SQL 运行结果
- 提供此页面的静态链接

#### 5. 组件列表展示

**前端**

- 展示通过审核的组件及其缩略图

**后端**

- 提供通过审核的组件列表信息

#### 6. 示例制作

- 完成起始实例制作