# Zevi AI study

Zevi AI study 是一个轻量化、极简风格、桌面优先的 AI 英语学习网站，面向旅游英语和商务英语场景。首版采用前后端分离结构：前端负责学习体验与本地 JSON 导入导出，后端负责代理调用大模型生成场景词单。

## 功能概览

- AI 生成旅游英语和商务英语主题词单
- 单词卡片学习与轻量复习节奏
- 本地 JSON 导入导出，不依赖数据库
- 游客模式使用，不需要登录注册
- 多 provider 架构，首版默认支持 OpenAI 兼容接口

## 项目结构

- `web/`: Vite + React + TypeScript 前端
- `server/`: Fastify + TypeScript 后端 API

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置后端环境变量

```bash
cp server/.env.example server/.env
```

3. 在 `server/.env` 中填写模型配置

```env
PORT=8787
DEFAULT_PROVIDER=openai-compatible
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-mini
```

4. 启动前后端开发环境

```bash
npm run dev
```

- 前端默认运行在 `http://localhost:5173`
- 后端默认运行在 `http://localhost:8787`

## 导入导出说明

- 站内学习记录仅保存在当前运行内存中
- 点击“导出学习文件”会下载一个 JSON 学习档案
- 点击“导入学习文件”可以恢复之前导出的进度
- 如果页面顶部出现“未导出变更”，说明当前学习记录尚未保存到本地文件

## 校验命令

```bash
npm run check
npm run test
```
