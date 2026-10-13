// Renders every carousel in posts/**/slides.mjs into PNG slides + one PDF.
// Usage:
//   npm run build                         -> build all posts
//   npm run build -- posts/react-hooks/01-usestate-vs-usereducer
//   npm run preview                       -> only write HTML (no PNG/PDF)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { codeToHtml } from 'shiki';
import config from '../config.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const htmlOnly = args.includes('--html-only');
const targets = args.filter((a) => !a.startsWith('--'));

const ATOM = `<svg viewBox="-11.5 -10.23 23 20.46" xmlns="http://www.w3.org/2000/svg"><circle r="2.05" fill="currentColor"/><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Tiny inline markup: `code`, **bold**, ==accent==, ~~accent-2~~
function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, '<code class="inline">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/==([^=]+)==/g, '<span class="hl">$1</span>')
    .replace(/~~([^~]+)~~/g, '<span class="hl2">$1</span>')
    .replace(/\n/g, '<br>');
}

// Kicker text is uppercased, but hook names (useState, useReducer, ...) keep their casing.
function kicker(text) {
  return text.split(/(\buse[A-Z]\w*)/).map((part, i) => (i % 2 ? part : part.toUpperCase())).join('');
}

async function codeBlock({ src, lang = 'tsx', file, size }) {
  const html = await codeToHtml(src.replace(/^\n|\n\s*$/g, ''), { lang, theme: 'one-dark-pro' });
  const style = size ? ` style="--code-size:${size}px"` : '';
  return `<div class="code-card"${style}><div class="bar"><i></i><i></i><i></i>${file ? `<span>${esc(file)}</span>` : ''}</div>${html}</div>`;
}

async function block(b) {
  if (b.lead) return `<p class="lead">${inline(b.lead)}</p>`;
  if (b.text) return `<p>${inline(b.text)}</p>`;
  if (b.code) return codeBlock(b.code);
  if (b.list) return `<ul class="list">${b.list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
  if (b.defs) return `<div class="defs">${b.defs.map(([k, v]) => `<div class="def"><div class="k">${esc(k)}</div><div class="v">${inline(v)}</div></div>`).join('')}</div>`;
  if (b.note) return `<div class="note">${inline(b.note)}</div>`;
  if (b.rule) return `<div class="rule">${inline(b.rule)}</div>`;
  if (b.table) {
    const head = `<tr>${b.table.head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr>`;
    const rows = b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
    return `<table class="cmp">${head}${rows}</table>`;
  }
  if (b.cols) {
    return `<div class="cols">${b.cols.map((c, i) => `<div class="col ${i ? 'b' : 'a'}"><h3>${esc(c.title)}</h3><ul class="list">${c.items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul></div>`).join('')}</div>`;
  }
  if (b.steps) {
    const steps = await Promise.all(b.steps.map(async (s, i) => `<div class="step"><div class="t"><span class="n">${i + 1}</span>${inline(s.title)}</div>${s.code ? await codeBlock(s.code) : ''}</div>`));
    return `<div class="steps">${steps.join('')}</div>`;
  }
  if (b.html) return b.html;
  throw new Error('Unknown block: ' + JSON.stringify(b));
}

async function renderSlide(s, i, total, meta) {
  const top = `<div class="top"><div class="series"><span class="logo">${ATOM}</span>${esc(meta.series)}</div><div class="page">${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div></div>`;
  const last = i === total - 1;
  const bottom = `<div class="bottom"><div class="author"><b>${esc(config.author.name)}</b> · ${esc(config.author.handle)}</div><div class="swipe">${last ? 'Save for later 🔖' : 'Swipe →'}</div></div>`;

  let inner = '';
  if (s.type === 'cover') {
    inner = `<div class="atom">${ATOM}</div><div class="content">
      <span class="badge">${esc(s.badge)}</span>
      <h1>${s.titleHtml ?? inline(s.title)}</h1>
      <p class="lead">${inline(s.subtitle)}</p></div>`;
  } else {
    const body = (await Promise.all((s.blocks || []).map(block))).join('');
    inner = `<div class="content">${s.kicker ? `<div class="kicker">${inline(kicker(s.kicker))}</div>` : ''}${s.title ? `<h2>${inline(s.title)}</h2>` : ''}${body}</div>`;
  }
  return `<section class="slide ${s.type || ''}" data-theme="${config.theme}">${top}${inner}${bottom}</section>`;
}

function page(sections, cssHref) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${cssHref}">
<style>:root{--w:${config.width}px;--h:${config.height}px}
@page{size:${config.width}px ${config.height}px;margin:0}
.slide{break-after:page}</style></head><body>${sections.join('\n')}</body></html>`;
}

function findPosts(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'out') out.push(...findPosts(p));
    else if (e.name === 'slides.mjs') out.push(dir);
  }
  return out;
}

const postDirs = targets.length ? targets.map((t) => path.resolve(t)) : findPosts(path.join(ROOT, 'posts'));
const browser = htmlOnly ? null : await chromium.launch();

for (const dir of postDirs) {
  const { meta, slides } = await import(pathToFileURL(path.join(dir, 'slides.mjs')).href + `?t=${Date.now()}`);
  const outDir = path.join(dir, 'out');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const cssHref = path.relative(outDir, path.join(ROOT, 'template/styles.css'));
  // fonts in styles.css are relative to template/, so this keeps working from any out/ dir
  const sections = await Promise.all(slides.map((s, i) => renderSlide(s, i, slides.length, meta)));
  const allHtml = path.join(outDir, 'all.html');
  fs.writeFileSync(allHtml, page(sections, cssHref));
  console.log(`\n▶ ${path.relative(ROOT, dir)} (${slides.length} slides)`);
  if (htmlOnly) { console.log('  HTML:', path.relative(ROOT, allHtml)); continue; }

  const pg = await browser.newPage({ viewport: { width: config.width, height: config.height } });
  await pg.goto(pathToFileURL(allHtml).href);
  await pg.evaluate(() => document.fonts.ready);

  // Layout guard: warn when content does not fit.
  const problems = await pg.evaluate(() => [...document.querySelectorAll('.slide')].flatMap((el, i) => {
    const issues = [];
    if (el.scrollHeight > el.clientHeight + 1) issues.push(`slide ${i + 1}: content is ${el.scrollHeight - el.clientHeight}px too tall`);
    el.querySelectorAll('pre, .code-card, table').forEach((c) => {
      if (c.scrollWidth > c.clientWidth + 1) issues.push(`slide ${i + 1}: ${c.tagName.toLowerCase()} is ${c.scrollWidth - c.clientWidth}px too wide`);
    });
    return issues;
  }));
  problems.forEach((p) => console.warn('  ⚠', p));

  const handles = await pg.$$('.slide');
  for (let i = 0; i < handles.length; i++) {
    await handles[i].screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  }
  await pg.pdf({ path: path.join(outDir, `${meta.slug}.pdf`), width: `${config.width}px`, height: `${config.height}px`, printBackground: true });
  await pg.close();
  console.log(`  ✓ ${handles.length} PNGs + ${meta.slug}.pdf → ${path.relative(ROOT, outDir)}`);
}

await browser?.close();
