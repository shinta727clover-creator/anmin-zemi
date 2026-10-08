// Netlify custom ignore command: Pages CMS saves images before their comic entry.
// Exit 0 to skip a build if only comic image files changed; exit 1 to build.
const { spawnSync } = require('node:child_process');

const from = process.env.CACHED_COMMIT_REF;
const to = process.env.COMMIT_REF;
if (!from || !to) process.exit(1); // Unknown revisions: build safely.
const diff = spawnSync('git', ['diff', '--name-only', '-z', from, to], {encoding:'utf8'});
if (diff.error || diff.status !== 0) process.exit(1); // Build on errors.
const changed = diff.stdout.split('\0').filter(Boolean);
if (changed.length > 0 && changed.every(path => path.startsWith('public/comics/'))) {
  console.log('Skipping build: comic image uploads only; awaiting comic entry update.');
  process.exit(0);
}
process.exit(1);
