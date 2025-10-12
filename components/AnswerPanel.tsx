import { Button } from "@/components/ui/button";
import WordCount from "./WordCount";
import { MarkdownRenderer } from "./markdown-renderer";
import Spinner from "./Loader";

interface Props {
  text: string;
  part: string;
  done: boolean;
  warning: string | null;
  submitting?: boolean;
  error?: string | null;
  feedback?: string | null;
  onChange: (val: string) => void;
  onClear: () => void;
  onMarkDone: () => void;
  onRetry: () => void;
  disabled?: boolean;
}

export default function AnswerPanel({
  text,
  part,
  done,
  warning,
  submitting,
  error,
  feedback,
  onChange,
  onClear,
  onMarkDone,
  onRetry,
  disabled = false,
}: Props) {
  return !done ? (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
      <WordCount text={text} part={part} />
      {disabled && (
        <div className="mb-2 rounded-md bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
          ⏰ Time&apos;s up! Fields are now locked and cannot be edited.
        </div>
      )}
      <textarea
        className={`flex-1 resize-none rounded-md border max-h-screen bg-background p-3 text-sm leading-relaxed outline-none ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        placeholder={disabled ? "Test time has expired" : "Start writing here…"}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        data-gramm="false"
      />
      {warning && <p className="mt-2 text-sm text-destructive">{warning}</p>}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onClear} disabled={disabled}>
          Clear
        </Button>
        <Button onClick={onMarkDone} disabled={disabled || text.length === 0}>
          Mark Done
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex h-full max-h-screen flex-col overflow-auto rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-muted-foreground">
        Feedback
      </h2>
      <div className="flex-1 overflow-auto">
        {submitting ? (
          <>
            <Spinner />
            <p>Submitting your response…</p>
          </>
        ) : error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={onRetry}>Retry</Button>
          </>
        ) : (
          <MarkdownRenderer content={feedback || "SOme error"} />
        )}
      </div>
    </div>
  );
}
