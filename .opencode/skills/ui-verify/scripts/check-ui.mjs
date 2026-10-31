#!/usr/bin/env node
/**
 * check-ui.mjs — cross-check kelas JSX vs CSS untuk INFRA-CARE.
 *
 * Pemakaian:
 *   node .opencode/skills/ui-verify/scripts/check-ui.mjs [root] [--strict] [--json]
 *
 * Exit 1 bila ada kelas JSX tanpa definisi CSS (di luar layout hook) atau camelCase.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname } from 'node:path';

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const target = argv.find((a) => !a.startsWith('--'));
const root = resolve(target || process.cwd());

// Kelas yang sengaja dipakai sebagai penanda layout / warisan dan tidak punya CSS.
const LAYOUT_HOOKS = new Set(['rw-page', 'tr-page', 'tr-progress-card']);

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function findFrontend(base) {
  const candidates = [
    { src: join(base, 'frontend', 'src'), label: 'frontend/src' },
    { src: join(base, 'src'), label: 'src' },
  ];
  for (const c of candidates) {
    if (existsSync(join(c.src, 'App.jsx')) || existsSync(c.src)) return c;
  }
  fail(`Tidak menemukan folder frontend/src atau src di ${base}`);
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const frontend = findFrontend(root);
const files = walk(frontend.src);
const jsxFiles = files.filter((f) => ['.jsx', '.tsx'].includes(extname(f)));
const cssFiles = files.filter((f) => extname(f) === '.css');

if (!jsxFiles.length) fail(`Tidak ada file JSX di ${frontend.src}`);
if (!cssFiles.length) fail(`Tidak ada file CSS di ${frontend.src}`);

// ---------- CSS ----------
function stripCssNoise(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/url\((?:[^()]|\([^)]*\))*\)/g, '')
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
}

const cssClasses = new Map(); // class -> Set(file)
const breakpoints = new Set();
const darkRules = [];
const camelProps = [];
let importantCount = 0;

for (const file of cssFiles) {
  const raw = readFileSync(file, 'utf8');
  const css = stripCssNoise(raw);
  for (const m of css.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)) {
    const name = m[1];
    if (!cssClasses.has(name)) cssClasses.set(name, new Set());
    cssClasses.get(name).add(relative(root, file));
  }
  for (const m of raw.matchAll(/@media\s*\([^)]*max-width\s*:\s*(\d+)px\s*\)/g)) {
    breakpoints.add(Number(m[1]));
  }
  for (const m of raw.matchAll(/html\.dark[^{]*\{/g)) {
    darkRules.push({ file: relative(root, file), line: raw.slice(0, m.index).split('\n').length });
  }
  // Properti camelCase (mis. alignItems) = salah tulis CSS, sering berasal dari inline style.
  for (const m of css.matchAll(/(?:^|[;{])\s*([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\s*:/gm)) {
    camelProps.push({
      property: m[1],
      file: relative(root, file),
      line: raw.slice(0, m.index).split('\n').length,
    });
  }
  importantCount += (raw.match(/!important/g) || []).length;
}

// ---------- JSX ----------
const classUsage = new Map(); // class -> Set(file)
const camelCase = [];
const classAttr = [];
let inlineHex = 0;
let hasCardTable = false;
let dataLabelCount = 0;

function addToken(token, file) {
  const t = token.trim();
  if (!t || !/^-?[A-Za-z_][A-Za-z0-9_-]*$/.test(t)) return;
  if (!classUsage.has(t)) classUsage.set(t, new Set());
  classUsage.get(t).add(relative(root, file));
  if (/[A-Z]/.test(t)) camelCase.push({ class: t, file: relative(root, file) });
}

function tokensFromExpression(expr, file) {
  // String literal di dalam ekspresi: ternary, konkatenasi, className={...}.
  // Lewati literal yang merupakan operand perbandingan (tab==='profil'), karena
  // itu nilai state, bukan nama kelas.
  for (const m of expr.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) {
    const before = expr.slice(Math.max(0, m.index - 8), m.index).trimEnd();
    if (/(===|!==|==|!=)$/.test(before)) continue;
    if (m[1] === '`') {
      const literal = m[2].replace(/\$\{[\s\S]*?\}/g, ' ');
      for (const t of literal.split(/\s+/)) addToken(t, file);
    } else {
      for (const t of m[2].split(/\s+/)) addToken(t, file);
    }
  }
}

for (const file of jsxFiles) {
  const source = readFileSync(file, 'utf8');
  inlineHex += (source.match(/#[0-9a-fA-F]{3,8}\b/g) || []).length;

  for (const m of source.matchAll(/className\s*=\s*"([^"]*)"/g)) {
    for (const t of m[1].split(/\s+/)) addToken(t, file);
  }
  for (const m of source.matchAll(/className\s*=\s*'([^']*)'/g)) {
    for (const t of m[1].split(/\s+/)) addToken(t, file);
  }
  for (const m of source.matchAll(/className\s*=\s*\{([\s\S]*?)\}/g)) {
    tokensFromExpression(m[1], file);
  }
  for (const m of source.matchAll(/(?:^|\s)class\s*=/g)) {
    classAttr.push(relative(root, file));
  }
  if (/\b(kl-table|dm-table)\b/.test(source)) hasCardTable = true;
  dataLabelCount += (source.match(/data-label\s*=/g) || []).length;
}

// ---------- Analisis ----------
const used = [...classUsage.keys()].sort();
const missing = used.filter((c) => !cssClasses.has(c) && !LAYOUT_HOOKS.has(c));
const hooks = used.filter((c) => !cssClasses.has(c) && LAYOUT_HOOKS.has(c));
const unusedCss = [...cssClasses.keys()].filter((c) => !classUsage.has(c)).sort();

const errors = [];
const warnings = [];

if (missing.length) {
  errors.push({
    code: 'MISSING_CSS',
    message: `${missing.length} kelas dipakai di JSX tetapi tidak punya definisi CSS`,
    items: missing.map((c) => ({ class: c, files: [...classUsage.get(c)] })),
  });
}
if (camelCase.length) {
  errors.push({
    code: 'CAMEL_CASE',
    message: `${camelCase.length} kelas memakai camelCase (gunakan kebab-case)`,
    items: camelCase,
  });
}
if (classAttr.length) {
  warnings.push({
    code: 'CLASS_ATTR',
    message: `Gunakan className, bukan class (${classAttr.length} kemunculan)`,
    items: classAttr,
  });
}
if (hooks.length) {
  warnings.push({
    code: 'LAYOUT_HOOK',
    message: `${hooks.length} layout hook sengaja tanpa CSS`,
    items: hooks,
  });
}
if (camelProps.length) {
  warnings.push({
    code: 'CAMEL_PROPERTY',
    message: `${camelProps.length} properti CSS memakai camelCase (tidak dikenali browser)`,
    items: camelProps.map((p) => `${p.file}:${p.line} — ${p.property}`),
  });
}
if (hasCardTable && dataLabelCount < 10) {
  warnings.push({
    code: 'DATA_LABEL',
    message: `Tabel kartu ditemukan tetapi data-label hanya ${dataLabelCount}; cek tampilan mobile`,
    items: [],
  });
}
if (breakpoints.size && !breakpoints.has(820) && hasCardTable) {
  warnings.push({
    code: 'BREAKPOINT',
    message: 'Tidak ada breakpoint 820px untuk tabel kartu',
    items: [...breakpoints].sort((a, b) => a - b),
  });
}

const report = {
  root,
  source: frontend.label,
  jsxFiles: jsxFiles.length,
  cssFiles: cssFiles.length,
  classesUsed: used.length,
  classesDefined: cssClasses.size,
  missing,
  camelCase,
  layoutHooks: hooks,
  camelProps,
  breakpoints: [...breakpoints].sort((a, b) => a - b),
  darkRules: darkRules.length,
  important: importantCount,
  inlineHex,
  dataLabel: dataLabelCount,
  unusedCss: unusedCss.length,
  errors,
  warnings,
};

if (flags.has('--json')) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(errors.length ? 1 : 0);
}

console.log('INFRA-CARE UI CHECK');
console.log('='.repeat(52));
console.log(`Root        : ${root}`);
console.log(`Sumber      : ${frontend.label}`);
console.log(`File        : ${jsxFiles.length} JSX, ${cssFiles.length} CSS`);
console.log(`Kelas       : ${used.length} dipakai, ${cssClasses.size} didefinisikan`);
console.log(`Breakpoint  : ${report.breakpoints.map((b) => `≤${b}px`).join(', ') || '-'}`);
console.log(`Dark rules  : ${darkRules.length}`);
console.log(`Hex inline  : ${inlineHex}`);
console.log('');

if (errors.length) {
  for (const err of errors) {
    console.log(`✖ [${err.code}] ${err.message}`);
    for (const item of err.items.slice(0, 40)) {
      if (typeof item === 'string') console.log(`   - ${item}`);
      else if (item.files) console.log(`   - .${item.class}  ← ${item.files.join(', ')}`);
      else console.log(`   - ${item.class}  ← ${item.file}`);
    }
    if (err.items.length > 40) console.log(`   ... dan ${err.items.length - 40} lainnya`);
  }
} else {
  console.log('✔ Semua kelas JSX punya definisi CSS.');
  console.log('✔ Tidak ada kelas camelCase.');
}

if (warnings.length) {
  console.log('');
  for (const warn of warnings) {
    console.log(`⚠ [${warn.code}] ${warn.message}`);
    for (const item of warn.items.slice(0, 10)) {
      console.log(`   - ${typeof item === 'string' ? item : JSON.stringify(item)}`);
    }
  }
}

console.log('');
console.log(`ℹ ${unusedCss.length} kelas CSS tidak terdeteksi di JSX (bisa dipakai dinamis; bukan error).`);
if (report.breakpoints.length && !report.breakpoints.includes(480)) {
  console.log('ℹ Tidak ada breakpoint 480px; pastikan tampilan 390px tetap rapi.');
}

const strictWarnings = warnings.filter((w) => w.code !== 'LAYOUT_HOOK');
if (flags.has('--strict') && strictWarnings.length) {
  console.log('');
  console.log('✖ Mode strict: warning dianggap gagal (layout hook diabaikan).');
  process.exit(1);
}

process.exit(errors.length ? 1 : 0);
