"use client"
import ReactMarkdown from "react-markdown"

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral max-w-none text-foreground">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
