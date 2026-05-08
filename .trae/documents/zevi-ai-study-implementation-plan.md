# Zevi AI study 实施计划

## Summary

- 目标产品：开发一个轻量化、极简风格、桌面优先的 AI 英语学习网站 `Zevi AI study`。
- 目标用户：以中文用户为主，聚焦旅游英语和商务英语场景。
- MVP 核心：由 AI 生成场景词单，用户在站内完成单词记忆、复习与掌握状态管理。
- 架构决策：采用前后端分离；前端负责学习体验与本地文件数据管理，后端负责代理调用大模型接口。
- 数据约束：不做账号体系、不做服务端持久化；学习数据通过本地 JSON 文件导入/导出保存。
- 运行范围：首版仅考虑本地运行，不规划正式线上部署。

## Current State Analysis

- 当前工作区几乎为空，仅存在 `/workspace/README.md`，内容只有项目标题 `# AI-study`。
- 未发现现有前端工程文件，如 `package.json`、`index.html`、`vite.config.*`、`tsconfig.json`。
- 未发现现有后端服务、接口定义、数据模型、设计文档或 `.trae/documents/` 目录。
- 这意味着本项目应按 0 到 1 绿地项目规划，技术选型、目录结构、页面信息架构和数据契约都需要首次建立。

## Assumptions & Decisions

- 界面语言：以中文为主，学习内容保留英文原文，解释与操作文案中文化。
- 视觉方向：极简、轻量、低干扰，突出留白、明确层级、低饱和配色和顺滑反馈。
- 账号体系：首版为游客模式，不做登录/注册，不做多端同步。
- 数据持久化：学习档案以本地 JSON 文件作为正式保存介质；应用运行时在内存中维护状态，并提供未导出提醒。
- 内容来源：不内置固定词库，重点支持“按场景由 AI 生成词单”，首批重点支持“旅游英语”和“商务英语”主题。
- 模型接入：后端抽象多提供商适配层，首版优先支持 OpenAI 兼容接口；通过配置扩展不同 provider。
- 部署方式：仅规划本地开发/本地运行链路，后续若需要上线，可在现有前后端分离基础上外扩。
- 范围控制：MVP 不包含音频发音、真人语音对练、支付体系、课程体系、社交功能、服务端数据库。

## Proposed Changes

### 1. 建立项目骨架

创建以下结构，形成轻量但清晰的前后端分层：

- `/workspace/package.json`
  - 使用 npm workspaces 管理 `web` 和 `server` 两个子项目。
  - 提供统一开发脚本，如同时启动前后端、本地构建、测试。
- `/workspace/README.md`
  - 更新为真实项目说明，包含本地启动方式、环境变量、导入导出说明。
- `/workspace/web/`
  - 使用 `Vite + React + TypeScript` 搭建前端。
- `/workspace/server/`
  - 使用 `Node.js + TypeScript + Fastify` 搭建后端 API 代理。

选择该结构的原因：

- 前后端职责清晰，符合“前端本地学习体验 + 后端代理 AI 请求”的要求。
- 对本地运行足够轻量，不需要数据库和复杂基础设施。
- 后续若需要上线，可直接保留目录结构而不必重构产品边界。

### 2. 前端信息架构与页面规划

在 `/workspace/web/src/` 下规划以下页面和模块：

- `/workspace/web/src/main.tsx`
  - 前端入口，挂载路由和全局样式。
- `/workspace/web/src/App.tsx`
  - 应用骨架，承载布局、路由出口和全局状态初始化。
- `/workspace/web/src/router.tsx`
  - 路由配置，定义页面跳转关系。
- `/workspace/web/src/styles/global.css`
  - 全局基础样式、主题变量、极简风格基础规范。
- `/workspace/web/src/styles/tokens.css`
  - 颜色、圆角、阴影、字体层级等设计 token。

页面建议：

- `/workspace/web/src/pages/HomePage.tsx`
  - 首页，展示产品定位、当前学习档案概览、快速入口。
  - 提供“新建词单”“导入学习文件”“继续复习”主操作。
- `/workspace/web/src/pages/GeneratePage.tsx`
  - AI 生成词单页。
  - 用户输入主题、场景、难度、词数，调用后端生成词单预览。
- `/workspace/web/src/pages/ReviewPage.tsx`
  - 记忆与复习主界面。
  - 以卡片流或双栏卡片形式展示单词、释义、例句、记忆提示和掌握操作。
- `/workspace/web/src/pages/LibraryPage.tsx`
  - 词单库页面。
  - 展示已生成的词单、学习进度、可继续复习/导出/删除。
- `/workspace/web/src/pages/SettingsPage.tsx`
  - 显示当前后端服务状态、可选模型提供商、数据导入导出入口和使用说明。

关键组件建议：

- `/workspace/web/src/components/AppShell.tsx`
  - 极简导航框架。
- `/workspace/web/src/components/WordCard.tsx`
  - 单词卡片组件，支持“显示答案/标记掌握/稍后复习”。
- `/workspace/web/src/components/ProgressPanel.tsx`
  - 统计今日待复习、已掌握、学习连续性等摘要。
- `/workspace/web/src/components/EmptyState.tsx`
  - 空状态提示，减少首屏困惑。
- `/workspace/web/src/components/ImportExportBar.tsx`
  - 导入/导出学习文件操作条。

### 3. 前端数据模型与本地文件流程

在 `/workspace/web/src/types/study.ts` 中定义统一数据模型，建议学习文件结构如下：

```json
{
  "version": 1,
  "profile": {
    "name": "Guest",
    "language": "zh-CN"
  },
  "packs": [
    {
      "id": "pack_xxx",
      "topic": "商务会议",
      "scene": "旅游英语 | 商务英语",
      "level": "A2-B1",
      "createdAt": "2026-05-08T12:00:00.000Z",
      "cards": [
        {
          "id": "card_xxx",
          "word": "itinerary",
          "phonetic": "/aI'tIn?reri/",
          "partOfSpeech": "noun",
          "meaningZh": "行程安排",
          "exampleEn": "Could you send me the updated itinerary?",
          "exampleZh": "你可以把更新后的行程发给我吗？",
          "memoryTip": "联想 trip planning",
          "tags": ["travel", "business"]
        }
      ]
    }
  ],
  "progress": {
    "card_xxx": {
      "status": "new",
      "mastery": 0,
      "reviewCount": 0,
      "lastReviewedAt": null,
      "nextReviewAt": null
    }
  }
}
```

新增前端数据模块：

- `/workspace/web/src/store/useStudyStore.ts`
  - 管理当前学习档案、词单列表、复习队列、未保存状态。
- `/workspace/web/src/lib/exportImport.ts`
  - 负责 JSON 文件导出、导入、版本校验、格式错误提示。
- `/workspace/web/src/lib/reviewQueue.ts`
  - 计算待复习卡片，采用简化掌握度策略而非复杂 SRS。

关键流程：

- 新用户进入首页后，可直接创建空学习档案并开始生成词单。
- AI 生成成功后，词单写入当前内存档案。
- 用户学习过程中所有修改都标记为“未导出”。
- 用户通过“导出学习文件”下载最新 JSON。
- 用户可在任意时间导入既有 JSON 文件恢复学习状态。

这样设计的原因：

- 与“数据存在本地即可”一致，不引入数据库。
- 比完整 SRS 更轻，更适合首版快速实现。
- 用“未导出提醒”弥补仅文件保存带来的数据丢失风险。

### 4. 学习交互与复习策略

在 `/workspace/web/src/lib/reviewQueue.ts` 和 `ReviewPage.tsx` 中实现以下交互：

- 单词卡默认先展示英文单词和词性。
- 用户点击后显示中文释义、例句、记忆提示。
- 每张卡提供 3 个动作：
  - `不会`
  - `模糊`
  - `掌握`
- 根据动作更新 `mastery` 与 `nextReviewAt`：
  - `不会`：降低掌握度，优先重新出现。
  - `模糊`：短间隔回队。
  - `掌握`：提高掌握度并延后出现。
- 首页和词单库展示：
  - 今日待复习数
  - 已学习单词数
  - 已掌握比例

采用简化复习算法而非完整 SM-2 的原因：

- MVP 重点是可用性和体验，不是算法复杂度。
- 用户当前场景更偏“场景词汇快速记忆”，简单掌握度足够支撑。
- 后续若验证有效，再升级为更正式的 SRS。

### 5. 后端 API 与多提供商模型适配

在 `/workspace/server/src/` 中规划以下后端文件：

- `/workspace/server/src/index.ts`
  - 启动 Fastify 服务并注册所有路由。
- `/workspace/server/src/config/env.ts`
  - 读取本地环境变量，如默认 provider、base URL、API key、model。
- `/workspace/server/src/routes/health.ts`
  - 提供健康检查接口。
- `/workspace/server/src/routes/providers.ts`
  - 返回当前可用 provider 列表与默认模型信息。
- `/workspace/server/src/routes/generate.ts`
  - 提供 AI 生成词单接口。
- `/workspace/server/src/services/providerRegistry.ts`
  - 维护 provider 配置和适配器选择逻辑。
- `/workspace/server/src/services/openaiCompatibleProvider.ts`
  - 处理 OpenAI 兼容接口的请求组装与响应解析。
- `/workspace/server/src/prompts/generateWordPack.ts`
  - 存放生成词单的系统提示词与输出格式要求。
- `/workspace/server/src/types/provider.ts`
  - 约束 provider 与模型配置结构。

API 设计：

- `GET /api/health`
  - 返回服务状态，供前端设置页和启动时探测。
- `GET /api/providers`
  - 返回可用模型提供商、默认模型、是否配置完成。
- `POST /api/generate-word-pack`
  - 输入：
    - `topic`
    - `scene`
    - `difficulty`
    - `wordCount`
  - 输出：
    - 标准化词单对象，字段对齐前端 `packs/cards` 结构。

后端职责边界：

- 只做代理和结构化输出，不保存任何用户学习数据。
- 对 AI 输出做 schema 校验；若结构非法，自动重试一次。
- 返回前端可直接消费的标准化 JSON，避免前端承担提示词和解析复杂度。

### 6. AI 词单生成规则

在 `/workspace/server/src/prompts/generateWordPack.ts` 中固定输出契约，要求模型：

- 生成适合旅游英语或商务英语场景的高频词。
- 输出词数可配置，首版默认 `8-15` 个。
- 每个词必须返回：
  - 单词
  - 音标
  - 词性
  - 中文释义
  - 英文例句
  - 中文例句解释
  - 记忆提示
  - 标签
- 输出严格 JSON，不允许多余说明文本。

失败兜底策略：

- 若 provider 未配置：返回明确错误，引导用户在本地环境变量中补全。
- 若模型返回非 JSON：服务端先尝试提取 JSON，再进行一次修复重试。
- 若仍失败：返回可读错误信息，前端展示“重新生成”入口。

### 7. 视觉与体验规范

前端实现需围绕“体验要好，界面极简”执行：

- 设计风格：
  - 大留白、少颜色、少边框、低噪音。
  - 首页只保留一个主目标区和少量状态信息。
- 配色建议：
  - 以浅色背景为主，辅以深灰文字和单一强调色。
- 字体策略：
  - 中文界面用清晰、现代的无衬线字体；英文单词可用更有识别度的字体层级突出。
- 交互反馈：
  - 生成中、导入中、导出成功、未保存提醒都要有明确反馈。
- 学习效率：
  - 避免过多弹窗和装饰动画；只保留必要过渡与悬停反馈。

建议将视觉实现拆分为：

- `/workspace/web/src/styles/tokens.css`
  - 统一主题和尺寸变量。
- `/workspace/web/src/styles/global.css`
  - 重置、排版、页面基础布局。
- 组件内局部样式
  - 保持模块独立，避免全局样式耦合。

### 8. 环境变量与本地运行配置

在后端增加本地环境变量约定：

- `/workspace/server/.env.example`
  - `PORT`
  - `DEFAULT_PROVIDER`
  - `OPENAI_BASE_URL`
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`

前端不保存 API key；前端只请求本地后端 API。

该决定的原因：

- 保持真实 AI 接入能力。
- 避免浏览器暴露密钥。
- 满足“仅本地运行”的前提下仍有合理安全边界。

### 9. 测试与质量保障

建议补充以下验证层：

- 前端单元测试：
  - `exportImport.ts` 的导入导出与版本校验。
  - `reviewQueue.ts` 的复习队列与掌握度计算。
- 后端单元测试：
  - provider 请求参数组装。
  - 模型响应标准化。
  - 非法 JSON 的容错处理。
- 前端手工验收：
  - 创建词单
  - 复习单词
  - 导出 JSON
  - 清空后重新导入恢复
  - provider 未配置时错误提示

建议测试文件位置：

- `/workspace/web/src/lib/exportImport.test.ts`
- `/workspace/web/src/lib/reviewQueue.test.ts`
- `/workspace/server/src/services/openaiCompatibleProvider.test.ts`

## Implementation Order

推荐执行顺序如下：

1. 初始化根工作区、`web`、`server` 基础工程与脚本。
2. 搭建前端基础布局、路由、设计 token 和极简首页。
3. 实现学习档案数据模型、状态管理、导入导出能力。
4. 完成 AI 生成页和词单库页的静态与状态联动。
5. 搭建后端 Fastify 服务、provider 抽象与 `generate-word-pack` 接口。
6. 接通前后端，完成词单生成到前端落库的闭环。
7. 实现复习页、掌握度更新与首页概览统计。
8. 增加错误处理、未导出提醒和空状态优化。
9. 补充关键测试并完成本地联调。

## Verification Steps

计划执行完成后，应至少验证以下内容：

- 本地执行 `npm install` 后可成功安装根工作区依赖。
- 执行统一开发命令后，前端与后端都能正常启动。
- 首页可在无数据情况下正确显示空状态。
- 输入“旅游英语/商务英语”主题后，可通过 AI 成功生成词单。
- 生成后的词单可进入复习流程，并正确更新掌握状态。
- 当前学习档案可导出为 JSON 文件。
- 导出的 JSON 可被重新导入，且词单与进度完整恢复。
- provider 未配置、AI 返回异常、导入非法 JSON 时，界面和接口都能给出明确错误提示。

## Out Of Scope

- 用户注册、登录、云端同步。
- 服务端数据库与学习历史持久化。
- 音频发音、语音识别、语音陪练。
- 支付订阅、课程商城、社群互动。
- 多人协作或教师后台。
