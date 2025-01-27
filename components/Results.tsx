import Stats from "@/components/Stats";
import { useState } from "react";
import { motion } from "framer-motion";

interface ResultsProps {
  result: string;
  attempts: number;
  guides: string[][];
  stats: {
    gamesPlayed: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
  };
  correctWord: string[];
  hardMode: boolean;
}

export default function Results({
  result,
  attempts,
  guides,
  stats,
  correctWord,
  hardMode,
}: ResultsProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const emojiMap = { g: "🟩", o: "🟨", r: "⬜" };
    const guideEmojis = guides
      .map((row) =>
        row.map((g) => emojiMap[g as keyof typeof emojiMap]).join("")
      )
      .join("\n");

    const hardModeIndicator = hardMode ? "⭐" : "";
    return `Wordle ${attempts}/6${hardModeIndicator}\n\n${guideEmojis}`;
  };

  const handleShare = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (result === "undefined") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && window.location.reload()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto"
      >
        <div className="max-h-[80vh] overflow-y-auto space-y-6">
          {/* Result Header */}
          <div className="text-center space-y-2">
            {result === "win" ? (
              <>
                <h1 className="text-4xl font-bold text-green-500">
                  Congratulations!
                </h1>
                <p className="text-gray-600 text-lg">
                  Solved in {attempts} {attempts === 1 ? "try" : "tries"}!{" "}
                  {hardMode && <span className="text-yellow-500">⭐</span>}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-red-500">Game Over</h1>
                <p className="text-gray-600 text-lg">
                  The word was:{" "}
                  <span className="font-bold text-xl">
                    {correctWord.join("").toUpperCase()}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-gray-100/50 backdrop-blur rounded-2xl p-6">
            <Stats {...stats} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className={`
                ${result === "win" ? "bg-green-500" : "bg-red-500"}
                text-white font-semibold py-4 px-6 rounded-xl
                transition-all duration-200 transform hover:scale-[1.02]
                active:scale-95 hover:shadow-lg hover:brightness-110
              `}
            >
              Play Again
            </button>
            <button
              onClick={handleShare}
              disabled={copied}
              className={`
                ${copied ? "bg-green-500" : "bg-blue-500"}
                text-white font-semibold py-4 px-6 rounded-xl
                transition-all duration-200 transform hover:scale-[1.02]
                active:scale-95 hover:shadow-lg hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {copied ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 animate-[popIn_0.3s_ease-out]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share Result
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
