import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without another dependency.
import { test } from 'node:test'

function article() {
    const path = 'src/content/posts/kylin-ec20-4g.md'
    assert.ok(fs.existsSync(path), 'The approved Kylin EC20 article must exist')
    return fs.readFileSync(path, 'utf8').replaceAll('\r\n', '\n')
}

test('the Kylin article retains all 44 source code blocks in their original order', () => {
    const blocks = [...article().matchAll(/^```[^\n]*\n([\s\S]*?)^```\s*$/gm)].map(match => match[1].trim())
    assert.equal(blocks.length, 44)
    // Keep the source fingerprint portable because the original docs are gitignored.
    const digest = createHash('sha256').update(blocks.join('\u0000')).digest('hex')
    assert.equal(digest, '942b836808497ca3fd0869aeb332418f74b09c024510426cfcfbff61ad3612c9')
})

test('the article preserves its x86 QMI environment and the limits of the recorded results', () => {
    const text = article()
    assert.match(text, /title: "麒麟系统使用4G模组"/)
    assert.match(text, /category: "embedded"/)
    assert.match(text, /pubDate: "2026-10-16T00:00:00\+08:00"/)
    assert.match(text, /x86_64/)
    assert.match(text, /5\.4\.18-110-generic/)
    assert.match(text, /QConnectManager_Linux_V1\.6\.8/)
    assert.ok(text.includes('本次博客整理没有重新操作设备'))
    assert.ok(text.includes('整机或模组断电上电未单独验证'))
    assert.match(text, /警告未单独验证消除/)
    assert.match(text, /13 次全由竞争造成.*推断/)
    assert.match(text, /SIM.*热插拔[\s\S]*待验证/)
    assert.ok(!/当前窗口中模型|本次聊天窗口|本窗口消息段落/.test(text))
    assert.equal((text.match(/^## \d+\./gm) ?? []).length, 12)
})

test('both original Mermaid diagrams have safe static image counterparts', () => {
    const text = article()
    for (const name of ['ec20-qmi-architecture.svg', 'ec20-qmi-connection-stages.svg']) {
        assert.ok(text.includes(name))
        const path = `src/images/posts/kylin-ec20/${name}`
        assert.ok(fs.existsSync(path), `Missing static diagram: ${name}`)
        const svg = fs.readFileSync(path, 'utf8')
        assert.match(svg, /<title[ >]/)
        assert.match(svg, /<desc[ >]/)
        assert.match(svg, /wwan0/)
        assert.ok(!/<script|<foreignObject|\son\w+=|(?:href|src)=/i.test(svg))
    }
    assert.equal((text.match(/```mermaid/g) ?? []).length, 2)
})
