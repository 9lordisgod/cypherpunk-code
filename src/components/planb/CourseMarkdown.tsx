import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CourseMarkdownProps = {
  content: string;
};

export function CourseMarkdown({ content }: CourseMarkdownProps) {
  return (
    <div className="course-markdown prose-cypher">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:underline"
              style={{ color: "var(--planb-orange)" }}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              className="course-markdown__image"
            />
          ),
          h3: ({ children }) => (
            <h3 className="course-markdown__h3">{children}</h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}