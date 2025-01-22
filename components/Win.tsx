import Stats from "@/components/Stats";
import { useState } from "react";

interface WinProps {
  win: boolean;
  attempts: number;
  guides: string[][];
  stats: {
    gamesPlayed: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
  };
}

export default function Win({ win, attempts, guides, stats }: WinProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const emojiMap = { g: "🟩", o: "🟨", r: "⬜" };
    const guideEmojis = guides
      .map((row) =>
        row.map((g) => emojiMap[g as keyof typeof emojiMap]).join("")
      )
      .join("\n");

    return `Wordle ${attempts}/6\n\n${guideEmojis}`;
  };

  const handleShare = async () => {
    const text = generateShareText();

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log(error);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    win && (
      <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white shadow-xl rounded-md p-8 max-w-md mx-4 text-center transform animate-[slideDown_0.3s_ease-out]">
          <h1 className="text-4xl font-bold mb-4">CONGRATULATIONS!</h1>
          <p className="text-gray-600 mb-6">
            You solved it in {attempts} {attempts === 1 ? "try" : "tries"}! 🎉
          </p>

          <Stats {...stats} />

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors relative"
            >
              {copied ? "Copied!" : "Share"}
              {copied && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  Copied to clipboard!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
