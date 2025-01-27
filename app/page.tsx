"use client";

import { useEffect, useState, useCallback } from "react";
import { words } from "@/lib/words";
import { handleKeyDown, handleEnterDown } from "@/funcs/typing";
import Rows from "@/components/Rows";
import Results from "@/components/Results";
import Keyboard from "@/components/Keyboard";
import { Infinity } from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";

interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
}

export interface LetterStatus {
  [key: string]: "unused" | "wrong" | "present" | "correct";
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState<string[]>([]);
  const [guides, setGuides] = useState<string[][]>([]);
  const [rows, setRows] = useState<string[][]>(
    Array(6)
      .fill([])
      .map(() => Array(5).fill(""))
  );
  const [activeRow, setActiveRow] = useState(0);
  const [win, setWin] = useState("undefined");
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wordleStats");
      return saved
        ? JSON.parse(saved)
        : {
            gamesPlayed: 0,
            wins: 0,
            currentStreak: 0,
            maxStreak: 0,
          };
    }
    return {
      gamesPlayed: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  });
  const [letterStatuses, setLetterStatuses] = useState<LetterStatus>(() => {
    const initial: LetterStatus = {};
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((letter) => {
      initial[letter] = "unused";
    });
    return initial;
  });
  const [hardMode, setHardMode] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setCorrectWord(words[Math.floor(Math.random() * words.length)].split(""));
  }, []);

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      handleKeyDown(
        e,
        currentIndex,
        setCurrentIndex,
        activeRow,
        setRows,
        letterStatuses,
        hardMode
      );
      handleEnterDown(
        e,
        correctWord,
        rows[activeRow],
        setGuides,
        activeRow,
        setActiveRow,
        setCurrentIndex,
        setWin,
        setLetterStatuses,
        hardMode,
        guides,
        activeRow > 0 ? rows[activeRow - 1] : [],
        letterStatuses,
        setError
      );
    },
    [
      correctWord,
      currentIndex,
      activeRow,
      rows,
      hardMode,
      guides,
      letterStatuses,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [correctWord, currentIndex, guides, activeRow, rows, keyDownHandler]);

  const updateStats = (won: boolean) => {
    setStats((prev) => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (won ? 1 : 0),
        currentStreak: won ? prev.currentStreak + 1 : 0,
        maxStreak: won
          ? Math.max(prev.maxStreak, prev.currentStreak + 1)
          : prev.maxStreak,
      };
      localStorage.setItem("wordleStats", JSON.stringify(newStats));
      return newStats;
    });
  };

  useEffect(() => {
    if (win === "win") {
      updateStats(true);
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [win, keyDownHandler]);

  useEffect(() => {
    if (win === "lose") {
      updateStats(false);
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [win, keyDownHandler]);

  useEffect(() => {
    if (error) {
      // Add shake animation to current row
      const currentRow = document.querySelector(
        `[data-row="${activeRow}"]`
      )?.parentElement;
      if (currentRow) {
        currentRow.classList.add("animate-[shake_0.5s_ease-in-out]");
        setTimeout(() => {
          currentRow.classList.remove("animate-[shake_0.5s_ease-in-out]");
        }, 500);
      }
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error, activeRow]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="absolute top-12 w-full flex justify-center">
        <div className="font-extrabold text-[2rem] md:text-[4rem] flex flex-col items-center">
          <div className="flex items-center gap-2">
            WORDLE
            <button
              onClick={() => setHardMode(!hardMode)}
              disabled={guides.length > 0}
              className={`
                transition-all duration-300 
                hover:opacity-80 md:ml-2
                flex items-center justify-center
                text-xl md:text-2xl
                w-8 h-8 md:w-12 md:h-12
                md:mt-2 mt-1
                rounded-full
                transform
                ${hardMode ? "rotate-90" : "rotate-0"}
                ${
                  hardMode
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }
                ${guides.length > 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
              title={
                guides.length > 0
                  ? "Hard Mode cannot be changed after first guess"
                  : hardMode
                  ? "Hard Mode: ON"
                  : "Hard Mode: OFF"
              }
            >
              <Infinity className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-light text-[1rem]">by Elliot</span>
          </div>
        </div>
      </div>
      <ErrorMessage message={error} />
      <Results
        result={win}
        attempts={activeRow + 1}
        guides={guides}
        stats={stats}
        correctWord={correctWord}
        hardMode={hardMode}
      />
      <main className="flex-1 flex flex-col items-center justify-center mt-32 md:mt-0">
        <div className="mb-8">
          <Rows rows={rows} activeRow={activeRow} guides={guides} />
        </div>
        <div className="fixed bottom-4 w-full max-w-2xl">
          <Keyboard
            letterStatuses={letterStatuses}
            onKeyPress={(key) => {
              let mockEvent;
              if (key === "⌫") {
                mockEvent = { key: "Backspace" } as KeyboardEvent;
              } else if (key === "ENTER") {
                mockEvent = { key: "Enter" } as KeyboardEvent;
              } else {
                mockEvent = { key: key.toLowerCase() } as KeyboardEvent;
              }
              keyDownHandler(mockEvent);
            }}
          />
        </div>
      </main>
    </div>
  );
}
