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

function stripHonkitAssets(html) {
  html = html.replace(/<link[^>]*href="[^"]*gitbook\/style\.css"[^>]*>\s*/gi, "");
  html = html.replace(/<link[^>]*href="[^"]*honkit-plugin[^"]*"[^>]*>\s*/gi, "");
  html = html.replace(/<link[^>]*href="[^"]*gitbook-plugin-[^"]*"[^>]*>\s*/gi, "");
  html = html.replace(/<meta name="generator"[^>]*>\s*/gi, "");
  return html;
}

/** Absolute path so theme CSS loads on every nested page. */
function fixStylesheetPath(html) {
  return html.replace(
    /<link rel="stylesheet" href="[^"]*styles\/website\.css"[^>]*>/i,
    `<link rel="stylesheet" href="${docBasePath}styles/website.css">`
  );
}

function resolveDocHref(filePath, href) {
  if (
    !href ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#") ||
    href.startsWith("javascript:")
  ) {
    return href;
  }

  if (href.startsWith("/") && !href.startsWith(docBasePath)) {
    return href;
  }

  if (href.startsWith(docBasePath)) {
    return href;
  }

  const relFile = filePath.slice(publicDir.length + 1);
  const fileDir = relFile.includes("/")
    ? relFile.slice(0, relFile.lastIndexOf("/") + 1)
    : "";

  const resolved = [];
  for (const part of (fileDir + href).split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(part);
  }

  return docBasePath + resolved.join("/");
}

/** <base href> breaks HonKit's relative sidebar links on nested pages → 404. */
function fixInternalLinks(html, filePath) {
  return html.replace(/\bhref="([^"]+)"/gi, (_match, href) => {
    return `href="${resolveDocHref(filePath, href)}"`;
  });
}

function removeBaseTag(html) {
  return html.replace(/<base[^>]*>\s*/gi, "");
}

function stripHonkitScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>\s*/gi, "");
}

function removeSearchUi(html) {
  html = html.replace(/<div id="book-search-input"[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(
    /<div id="book-search-results">\s*<div class="search-noresults">\s*([\s\S]*?)\s*<\/div>\s*<div class="search-results">[\s\S]*?<\/div>\s*<\/div>/gi,
    "$1"
  );
  return html;
}

function removeHonkitChrome(html) {
  html = html.replace(/<div class="book-header"[\s\S]*?<\/div>\s*/gi, "");
  html = html.replace(
    /<a href="[^"]*" class="navigation navigation-next[^"]*"[\s\S]*?<\/a>\s*/gi,
    ""
  );
  html = html.replace(
    /<li class="divider"><\/li>\s*<li>\s*<a[^>]*class="gitbook-link"[\s\S]*?<\/li>\s*/gi,
    ""
  );
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/gi, "");
  html = html.replace(
    /<link[^>]*href="[^"]*gitbook\/images\/[^"]*"[^>]*>\s*/gi,
    ""
  );
  return html;
}

function patchHtml(filePath) {
  let html = readFileSync(filePath, "utf8");

  if (!html.includes('rel="icon"')) {
    html = html.replace(
      /<head>/i,
      `<head>\n    <link rel="icon" href="/favicon-32x32.png" type="image/png">`
    );
  }

  const topBar = `
<div class="cp-doc-topbar">
  <button type="button" class="cp-doc-topbar__menu" aria-label="Toggle sidebar">☰</button>
  <a class="cp-doc-topbar__brand" href="/">
    <span class="cp-doc-topbar__mark">◆</span>
    <span>Cypherpunk Code</span>
  </a>
  <span class="cp-doc-topbar__badge">DOC</span>
  <a class="cp-doc-topbar__back" href="/">← Back to site</a>
</div>`;

  if (!html.includes("cp-doc-topbar")) {
    html = html.replace(/<body[^>]*>/i, (match) => `${match}\n${topBar}`);
  } else if (!html.includes("cp-doc-topbar__menu")) {
    html = html.replace(
      /<div class="cp-doc-topbar">\s*/,
      `<div class="cp-doc-topbar">\n  <button type="button" class="cp-doc-topbar__menu" aria-label="Toggle sidebar">☰</button>\n  `
    );
  }

  html = html.replace(/class="book honkit-cloak"/g, 'class="book cp-doc"');
  html = html.replace(/class="book with-summary"/g, 'class="book cp-doc"');
  html = html.replace(/class="book with-summary cp-doc"/g, 'class="book cp-doc"');
  html = html.replace(/class="book"/g, 'class="book cp-doc"');

  html = stripHonkitAssets(html);
  html = removeBaseTag(html);
  html = fixStylesheetPath(html);
  html = fixInternalLinks(html, filePath);
  html = removeSearchUi(html);
  html = removeHonkitChrome(html);
  html = stripHonkitScripts(html);

  const mobileNav = `<script>
(function () {
  var btn = document.querySelector(".cp-doc-topbar__menu");
  var book = document.querySelector(".book.cp-doc");
  if (!btn || !book) return;
  btn.addEventListener("click", function () {
    book.classList.toggle("sidebar-open");
  });
  book.querySelectorAll(".book-summary a").forEach(function (link) {
    link.addEventListener("click", function () {
      book.classList.remove("sidebar-open");
    });
  });
})();
</script>`;

  html = html.replace(/<\/body>/i, `${mobileNav}\n</body>`);

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