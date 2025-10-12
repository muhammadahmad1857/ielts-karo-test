import { countWords, minWordsFor } from "@/lib/utils";

interface Props {
  text: string;
  part: string;
}

export default function WordCount({ text, part }: Props) {
  const words = countWords(text);
  const minWords = minWordsFor(part);
  const isValid = words >= minWords;

  return (
    <div
      className={`mb-2 text-sm font-medium ${
        isValid ? "text-green-600" : "text-red-600"
      }`}
    >
      {words} / {minWords} words
    </div>
  );
}
