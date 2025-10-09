"use client"
import ReactMarkdown from "react-markdown"

type MarkdownViewerProps = {
  markdown: string
}

export default function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none prose-headings:mt-0 prose-headings:mb-2 prose-p:leading-relaxed prose-strong:font-semibold prose-code:font-mono text-foreground">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
