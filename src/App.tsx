import { useMemo, useState } from "react";
import { marked } from "marked";
import { createPostsFromModules, type Post } from "./content";

const modules = import.meta.glob("./content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const posts = createPostsFromModules(modules);

function groupByCategory(items: Post[]) {
  return items.reduce<Record<string, Post[]>>((acc, post) => {
    acc[post.category] ??= [];
    acc[post.category].push(post);
    return acc;
  }, {});
}

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState(posts[0]?.slug ?? "");
  const [keyword, setKeyword] = useState("");

  const filteredPosts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      );
    });
  }, [keyword]);

  const selected = posts.find((post) => post.slug === selectedSlug) ?? filteredPosts[0] ?? posts[0];
  const grouped = groupByCategory(filteredPosts);
  const html = selected ? marked.parse(selected.body) : "";

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="site-title">교행</h1>
        <input
          className="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="문서 검색"
        />

        <nav className="tree">
          {Object.entries(grouped).map(([category, categoryPosts]) => (
            <section key={category} className="category">
              <h2>{category}</h2>
              {categoryPosts.map((post) => (
                <button
                  key={post.slug}
                  className={post.slug === selected?.slug ? "active" : ""}
                  onClick={() => setSelectedSlug(post.slug)}
                >
                  {post.title}
                </button>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <main className="content">
        {selected ? (
          <article>
            <p className="category-label">{selected.category}</p>
            <h1>{selected.title}</h1>
            {selected.date && <p className="date">{selected.date}</p>}
            <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        ) : (
          <article>
            <h1>문서가 없습니다</h1>
            <p>
              <code>src/content</code> 폴더 안에 <code>.md</code> 파일을 추가하세요.
            </p>
          </article>
        )}
      </main>
    </div>
  );
}
