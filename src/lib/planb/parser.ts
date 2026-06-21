import type { PlanBCourseFrontmatter, PlanBChapter } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function parseSimpleYamlBlock(block: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentListKey: string | null = null;

  for (const line of block.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentListKey) {
      const list = result[currentListKey];
      if (Array.isArray(list)) {
        list.push(listMatch[1].trim());
      }
      continue;
    }

    const kvMatch = line.match(/^([\w_]+):\s*(.*)$/);
    if (!kvMatch) continue;

    const [, key, rawValue] = kvMatch;
    if (!rawValue) {
      currentListKey = key;
      result[key] = [];
      continue;
    }

    currentListKey = null;
    const trimmed = rawValue.trim();
    if (/^\d+$/.test(trimmed)) {
      result[key] = Number(trimmed);
    } else {
      result[key] = trimmed;
    }
  }

  return result;
}

function parseFrontmatter(block: string): PlanBCourseFrontmatter {
  const parsed = parseSimpleYamlBlock(block);
  const objectives = Array.isArray(parsed.objectives)
    ? (parsed.objectives as string[])
    : [];

  return {
    name: String(parsed.name ?? "Untitled course"),
    goal: String(parsed.goal ?? ""),
    objectives,
  };
}

export function parseCourseMarkdown(
  slug: string,
  language: string,
  raw: string
): {
  frontmatter: PlanBCourseFrontmatter;
  description: string;
  chapters: PlanBChapter[];
} {
  let body = raw;

  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) {
      const frontmatterBlock = body.slice(3, end).trim();
      body = body.slice(end + 3).trim();
      const frontmatter = parseFrontmatter(frontmatterBlock);
      const splitIndex = body.indexOf("\n+++");
      const descriptionPart = splitIndex === -1 ? body : body.slice(0, splitIndex).trim();
      const courseBody = splitIndex === -1 ? "" : body.slice(splitIndex + 4).trim();

      return {
        frontmatter,
        description: stripLeadingHeading(descriptionPart),
        chapters: extractChapters(slug, courseBody),
      };
    }
  }

  const splitIndex = body.indexOf("\n+++");
  const descriptionPart = splitIndex === -1 ? body : body.slice(0, splitIndex).trim();
  const courseBody = splitIndex === -1 ? "" : body.slice(splitIndex + 4).trim();

  return {
    frontmatter: {
      name: slug,
      goal: "",
      objectives: [],
    },
    description: stripLeadingHeading(descriptionPart),
    chapters: extractChapters(slug, courseBody),
  };
}

function stripLeadingHeading(text: string): string {
  const lines = text.split("\n");
  if (lines[0]?.startsWith("# ")) {
    return lines.slice(1).join("\n").trim();
  }
  return text.trim();
}

function extractChapters(slug: string, body: string): PlanBChapter[] {
  if (!body.trim()) return [];

  const lines = body.split("\n");
  const chapters: PlanBChapter[] = [];
  let currentPartTitle: string | undefined;
  let currentPartId: string | undefined;
  let currentChapter: {
    title: string;
    chapterId?: string;
    lines: string[];
  } | null = null;
  let chapterIndex = 0;

  const flushChapter = () => {
    if (!currentChapter) return;
    const title = currentChapter.title.trim();
    if (!title) {
      currentChapter = null;
      return;
    }
    chapterIndex += 1;
    const baseSlug = slugify(title) || `chapter-${chapterIndex}`;
    chapters.push({
      slug: `${baseSlug}-${chapterIndex}`,
      title,
      chapterId: currentChapter.chapterId,
      partTitle: currentPartTitle,
      partId: currentPartId,
      index: chapterIndex,
      content: currentChapter.lines.join("\n").trim(),
    });
    currentChapter = null;
  };

  for (const line of lines) {
    const partMatch = line.match(/^#\s+(.+)$/);
    const chapterMatch = line.match(/^##\s+(.+)$/);
    const partIdMatch = line.match(/^<partId>([^<]+)<\/partId>$/);
    const chapterIdMatch = line.match(/^<chapterId>([^<]+)<\/chapterId>$/);

    if (partIdMatch) {
      currentPartId = partIdMatch[1].trim();
      continue;
    }

    if (chapterIdMatch && currentChapter) {
      currentChapter.chapterId = chapterIdMatch[1].trim();
      continue;
    }

    if (partMatch && !chapterMatch) {
      flushChapter();
      currentPartTitle = partMatch[1].trim();
      continue;
    }

    if (chapterMatch) {
      flushChapter();
      currentChapter = {
        title: chapterMatch[1].trim(),
        lines: [],
      };
      continue;
    }

    if (currentChapter) {
      if (chapterIdMatch) {
        currentChapter.chapterId = chapterIdMatch[1].trim();
        continue;
      }
      currentChapter.lines.push(line);
    }
  }

  flushChapter();
  return chapters;
}

export function rewriteAssetUrls(markdown: string, courseSlug: string): string {
  const base = `https://raw.githubusercontent.com/PlanB-Network/bitcoin-educational-content/dev/courses/${courseSlug}`;
  return markdown.replace(
    /!\[([^\]]*)\]\(assets\/([^)]+)\)/g,
    (_match, alt, assetPath) => `![${alt}](${base}/assets/${assetPath})`
  );
}