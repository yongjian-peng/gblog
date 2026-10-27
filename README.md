# Yongjian Peng 的技术博客

基于 [Gblog](https://github.com/godruoyi/gblog) 和 Astro 的静态博客，采用暖米色与橙色的技术笔记风格。

## 功能

- 中文文章、分类与时间线
- 响应式布局与浅色／深色主题
- 按标题、摘要、标签进行站内搜索
- 自动文章目录、相关推荐与上一篇／下一篇
- Markdown 代码高亮、复制和表格排版
- 中文 SEO 信息与站点地图
- 保留现有可选统计、Giscus 评论及资源上传配置

## 本地开发

安装依赖后启动开发服务器：

```shell
npm install
npm run dev
```

构建与预览：

```shell
npm run build
npm run preview
```

静态文件生成到 `dist/`，可用于 GitHub Pages 等静态托管。

## 上传到 GitHub Pages

当前站点地址是 `https://yongjian-peng.github.io/`，部署在域名根目录，资源路径应为 `/assets/...`，无需添加 `/gblog` 前缀。

1. 执行 `npm run build`。构建结束会自动检查发布标记及页面引用的本地 CSS，检查失败时不要上传。
2. 将 **`dist/` 内的全部内容**上传到 `yongjian-peng.github.io` 发布仓库的根目录，包含隐藏文件 `.nojekyll`。不要将整个 `dist` 文件夹嵌套上传到根目录。
3. 手动上传产物时，Pages 发布源对应发布仓库的 `main` 分支、`/(root)`；等待该仓库的 Pages 构建与部署完成。
4. 确认线上首页及文章页显示正常，并在浏览器 Network 中检查 CSS 请求返回 `200`、类型为 `text/css`。如仍显示旧页面，可用 `Ctrl+F5` 刷新。

发布仓库中的目录应类似：

```text
.nojekyll
index.html
assets/
posts/
categories/
...
```

`public/.nojekyll` 会在每次构建时自动复制为 `dist/.nojekyll`。它用于跳过 GitHub Pages 的默认 Jekyll 处理，否则 `_slug_.xxxx.css` 等下划线开头的文件可能存在于仓库却无法在线访问。详见 [GitHub 官方说明](https://github.blog/news-insights/bypassing-jekyll-on-github-pages/)。Windows 复制或上传时请确认包含这个点号开头的文件。

HTML 和 `assets/` 必须来自同一次构建，整批更新，避免新 HTML 引用了未上传的哈希文件。需要单独复查产物时，可运行：

```shell
node scripts/check-pages-build.mjs
```

源仓库另有 `.github/workflows/deploy.yml`，通过 Actions 直接上传 `dist` 作为 Pages artifact；这与上述独立发布仓库的手动上传方式是两条部署路径，请按实际使用方式发布。

## 内容与配置

- `src/config.ts`：站点名称、导航、评论与统计配置。
- `src/content/posts/`：文章；文件名决定访问地址。
- `src/content/categories/`：分类；文章的 `category` 与分类文件名对应。
- `src/content/friends/index.yml`：友链。
- `src/images/theme/`：已按语义命名的页面素材。
- `src/styles/global.css`：公共主题、响应式布局和正文样式。

文章日期、代码和技术名称按原内容保留。已翻译的原文保留相应的来源说明；当前 RSS 页面未启用。

## 检查

```shell
node --experimental-strip-types --test tests/blog.test.mjs tests/rg200u-content.test.mjs tests/rk3588-vpn-content.test.mjs tests/kylin-ec20-content.test.mjs
npm run lint
npm run build
```

内置测试使用 Node.js 22.6 及以上版本的 TypeScript 类型擦除能力，无需安装额外测试框架。

## 致谢

感谢 Gblog 原作者 [Godruoyi](https://github.com/godruoyi)，以及提供原始页面基础的 [ScrewFast](https://github.com/mearashadowfax/ScrewFast)。Gblog 原项目采用 MIT 许可证，相关条款参见[原项目许可证](https://github.com/godruoyi/gblog/blob/astro/LICENSE)。
