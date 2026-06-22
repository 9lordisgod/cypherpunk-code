import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const docsDir = join(root, "docs");
const buildDir = join(docsDir, "_book");
const publicDir = join(root, "public", "doc");

const docBasePath = (() => {
  const raw = process.env.DOC_BASE_PATH ?? "/doc/";
  return raw.endsWith("/") ? raw : `${raw}/`;
})();

function walkHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtmlFiles(full, files);
    } else if (entry.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function patchHtml(filePath) {
  let html = readFileSync(filePath, "utf8");

  if (!html.includes("<base ")) {
    html = html.replace(
      /<head>/i,
      `<head>\n    <base href="${docBasePath}">`
    );
  }

  if (!html.includes('rel="icon"')) {
    html = html.replace(
      /<head>/i,
      `<head>\n    <link rel="icon" href="${docBasePath}../favicon-32x32.png" type="image/png">`
    );
  }

  const topBar = `
<div class="cp-doc-topbar">
  <a class="cp-doc-topbar__brand" href="/">
    <span class="cp-doc-topbar__mark">◆</span>
    <span>Cypherpunk Code</span>
  </a>
  <span class="cp-doc-topbar__badge">DOC</span>
  <a class="cp-doc-topbar__back" href="/">← Back to site</a>
</div>`;

  if (!html.includes("cp-doc-topbar")) {
    html = html.replace(/<body[^>]*>/i, (match) => `${match}\n${topBar}`);
  }

  html = html.replace(/class="book honkit-cloak"/g, 'class="book with-summary cp-doc"');
  html = html.replace(/class="book with-summary"/g, 'class="book with-summary cp-doc"');
  html = html.replace(/class="book"/g, 'class="book with-summary cp-doc"');

  // Remove HonKit's duplicate mobile header bar (we use cp-doc-topbar)
  html = html.replace(/<div class="book-header"[\s\S]*?<\/div>\s*/i, "");

  writeFileSync(filePath, html);
}

console.log(`Building GitBook documentation (base: ${docBasePath})...`);

execSync("npx honkit build", {
  cwd: docsDir,
  stdio: "inherit",
});

if (existsSync(publicDir)) {
  rmSync(publicDir, { recursive: true, force: true });
}

cpSync(buildDir, publicDir, { recursive: true });

const htmlFiles = walkHtmlFiles(publicDir);
for (const file of htmlFiles) {
  patchHtml(file);
}

console.log(`\nDocumentation built → public/doc/ (${htmlFiles.length} pages patched)`);
console.log("Preview: npm run docs:dev (port 4000) or npm run dev (port 3000/doc/)");