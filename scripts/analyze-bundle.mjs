#!/usr/bin/env node
/**
 * Reports gzip sizes for the production build and flags the initial JS
 * budget from spec §14 (under 150KB gz, excluding confetti).
 */
import { gzipSync } from 'node:zlib';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ASSETS_DIR = join(process.cwd(), 'dist', 'assets');
const BUDGET_BYTES = 150 * 1024;
const CONFETTI_PATTERN = /confetti/i;

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const files = (await readdir(ASSETS_DIR)).filter(
  (name) => name.endsWith('.js') || name.endsWith('.css'),
);

const rows = await Promise.all(
  files.map(async (name) => {
    const buffer = await readFile(join(ASSETS_DIR, name));
    return {
      name,
      raw: buffer.byteLength,
      gzip: gzipSync(buffer).byteLength,
      confetti: CONFETTI_PATTERN.test(name),
      css: name.endsWith('.css'),
    };
  }),
);

rows.sort((a, b) => b.gzip - a.gzip);

const initialJs = rows.filter((row) => !row.css && !row.confetti);
const initialJsGzip = initialJs.reduce((sum, row) => sum + row.gzip, 0);
const confettiGzip = rows
  .filter((row) => row.confetti)
  .reduce((sum, row) => sum + row.gzip, 0);
const cssGzip = rows
  .filter((row) => row.css)
  .reduce((sum, row) => sum + row.gzip, 0);

const report = {
  budgetBytes: BUDGET_BYTES,
  initialJsGzip,
  confettiGzip,
  cssGzip,
  withinBudget: initialJsGzip <= BUDGET_BYTES,
  files: rows,
};

console.log('\nBundle analysis (gzip)\n');
console.log(
  `${'file'.padEnd(48)} ${'raw'.padStart(10)} ${'gzip'.padStart(10)}`,
);
console.log('-'.repeat(70));
for (const row of rows) {
  const tag = row.confetti ? ' [lazy confetti]' : '';
  console.log(
    `${(row.name + tag).padEnd(48)} ${formatKb(row.raw).padStart(10)} ${formatKb(row.gzip).padStart(10)}`,
  );
}

console.log('\nInitial JS (excluding confetti):', formatKb(initialJsGzip));
console.log('Confetti chunk:', formatKb(confettiGzip));
console.log('CSS:', formatKb(cssGzip));
console.log(
  report.withinBudget
    ? `Budget: PASS (target < ${formatKb(BUDGET_BYTES)})`
    : `Budget: OVER (target < ${formatKb(BUDGET_BYTES)})`,
);

await writeFile(
  join(process.cwd(), 'dist', 'bundle-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

if (!report.withinBudget) {
  console.warn(
    '\nInitial JS is over the 150KB gz target. Keep confetti lazy and avoid new animation libraries.',
  );
}
