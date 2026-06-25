export type Post = {
  title: string;
  date?: string;
  category: string;
  slug: string;
  raw: string;
  body: string;
};

type FrontMatter = {
  title?: string;
  date?: string;
};

function parseFrontMatter(raw: string): { data: FrontMatter; body: string } {
  if (!raw.startsWith("---")) return { data: {}, body: raw };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: raw };

  const yaml = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const data: FrontMatter = {};

  for (const line of yaml.split("\n")) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim().replace(/^['\"]|['\"]$/g, "");
    if (key.trim() === "title") data.title = value;
    if (key.trim() === "date") data.date = value;
  }

  return { data, body };
}

function titleFromPath(path: string): string {
  const file = decodeURIComponent(path.split("/").pop() ?? "문서.md");
  return file.replace(/\.md$/, "");
}

function categoryFromPath(path: string): string {
  const parts = path.replace("./content/", "").split("/");
  parts.pop();
  return parts.length ? parts.map(decodeURIComponent).join(" / ") : "일반";
}

function slugFromPath(path: string): string {
  return path
    .replace("./content/", "")
    .replace(/\.md$/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

export function createPostsFromModules(modules: Record<string, string>): Post[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const { data, body } = parseFrontMatter(raw);
      return {
        title: data.title || titleFromPath(path),
        date: data.date,
        category: categoryFromPath(path),
        slug: slugFromPath(path),
        raw,
        body,
      };
    })
    .sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category, "ko");
      return a.title.localeCompare(b.title, "ko");
    });
}
