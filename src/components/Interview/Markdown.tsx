import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

/** Server-rendered Markdown for a chapter body: GFM tables, heading ids, highlighted code, and inline HTML/SVG (chapters are trusted local files). */
export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeHighlight, { detect: false }]]}
      components={{
        pre: CodeBlock,
        a: ({ href, children }) => {
          const external = href?.startsWith("http");
          return (
            <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
              {children}
            </a>
          );
        },
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
