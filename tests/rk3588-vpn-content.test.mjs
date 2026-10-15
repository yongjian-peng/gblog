import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without another dependency.
import { test } from 'node:test'

const path = 'src/content/posts/rk3588-vpn.md'
function article() {
    assert.ok(fs.existsSync(path), 'The approved RK3588 article must exist')
    return fs.readFileSync(path, 'utf8').replaceAll('\r\n', '\n')
}

test('RK3588 article retains the complete source tutorial and its 26 command blocks', () => {
    const source = article().match(/````markdown\n([\s\S]*?)\n````/)
    assert.ok(source, 'Keep the complete source appendix available')
    // The source docs are gitignored; this fingerprint also works in a fresh clone.
    const digest = createHash('sha256').update(source[1].trim()).digest('hex')
    assert.equal(digest, 'cbf225881461adb74384dbd200e51f7ead71e4aafbda380c81cc65e465df1257')
})

test('the recommended steps form a loopback-only two-device SSH maintenance path', () => {
    const main = article().split('````markdown')[0]
    assert.match(main, /title: "RK3588搭建 VPN"/)
    assert.match(main, /category: "embedded"/)
    assert.match(main, /pubDate: "2026-10-14T00:00:00\+08:00"/)
    assert.match(main, /GatewayPorts no/)
    assert.match(main, /AllowAgentForwarding no/)
    assert.match(main, /ProxyJump rk3588-vps/)
    assert.match(main, /Host rk3588-001[\s\S]*?Port 22001/)
    assert.match(main, /Host rk3588-002[\s\S]*?Port 22002/)
    assert.match(main, /-R 127\.0\.0\.1:22001:127\.0\.0\.1:22/)
    assert.match(main, /ExitOnForwardFailure=yes/)
    assert.match(main, /BatchMode=yes/)
    assert.match(main, /StrictHostKeyChecking=yes/)
    assert.match(main, /Host \*.*之前/)
    assert.match(main, /同名.*合并/)
    assert.match(main, /未.*(?:重新|实机).*验证|没有重新.*设备/)
})
