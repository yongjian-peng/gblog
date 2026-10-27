import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('dist')
const marker = await fs.stat(path.join(root, '.nojekyll')).catch(() => null)
assert.ok(marker?.isFile(), '缺少 dist/.nojekyll：GitHub Pages 的 Jekyll 构建会忽略 _ 开头的 CSS 等文件。')

const pages = []
async function collect(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            await collect(file)
        }
        else if (entry.name.endsWith('.html')) {
            pages.push(file)
        }
    }
}
await collect(root)
assert.ok(pages.length > 0, 'dist 中没有 HTML 页面，请先完成 Astro 构建。')

let stylesheets = 0
let localStylesheets = 0
function attribute(tag, name) {
    const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
    return match?.[1] ?? match?.[2] ?? match?.[3]
}
for (const file of pages) {
    const html = await fs.readFile(file, 'utf8')
    const base = new URL(path.relative(root, file).split(path.sep).join('/'), 'https://pages.invalid/')
    for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
        if (!attribute(tag, 'rel')?.toLowerCase().split(/\s+/).includes('stylesheet')) {
            continue
        }
        const href = attribute(tag, 'href')
        assert.ok(href, `${file}: 样式链接缺少 href`)
        stylesheets++
        const url = new URL(href, base)
        if (url.origin !== base.origin) {
            continue
        }
        const target = path.resolve(root, `.${decodeURIComponent(url.pathname)}`)
        assert.ok(target.startsWith(`${root}${path.sep}`), `${file}: 样式路径超出 dist`)
        const stat = await fs.stat(target).catch(() => null)
        assert.ok(stat?.isFile() && stat.size > 0, `${file}: 缺少 CSS 或文件为空 ${href}`)
        localStylesheets++
    }
}
assert.ok(stylesheets > 0, '没有找到样式引用，请核对构建产物和资源配置。')
console.log(`GitHub Pages 检查通过：.nojekyll、${pages.length} 个页面、${localStylesheets}/${stylesheets} 个本地 CSS 引用。`)
