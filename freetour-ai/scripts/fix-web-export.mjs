import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../dist/', import.meta.url)

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full)
    else if (full.endsWith('.html')) fixHtml(full)
  }
}

function fixHtml(file) {
  const input = readFileSync(file, 'utf8')
  const output = input.replace(/<script src="([^"]+_expo\/static\/js\/web\/[^"]+\.js)" defer><\/script>/g, '<script type="module" src="$1"></script>')
  if (output !== input) writeFileSync(file, output)
}

walk(root.pathname)
console.log('fixed web export html modules')
