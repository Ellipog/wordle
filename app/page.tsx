"use client";

import { useEffect, useState, useCallback } from "react";
import { words } from "@/lib/words";
import { handleKeyDown, handleEnterDown } from "@/funcs/typing";
import Rows from "@/components/Rows";
import Results from "@/components/Results";

interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
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

  useEffect(() => {
    setCorrectWord(words[Math.floor(Math.random() * words.length)].split(""));
  }, []);

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      handleKeyDown(e, currentIndex, setCurrentIndex, activeRow, setRows);
      handleEnterDown(
        e,
        correctWord,
        rows[activeRow],
        setGuides,
        activeRow,
        setActiveRow,
        setCurrentIndex,
        setWin
      );
    },
    [correctWord, currentIndex, activeRow, rows]
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

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="absolute flex top-24 w-full justify-center items-center flex-col font-extrabold text-[4rem]">
        WORDLE ∞<span className="font-light text-[1rem]">by Elliot</span>
      </div>
      <Results
        result={win}
        attempts={activeRow + 1}
        guides={guides}
        stats={stats}
        correctWord={correctWord}
      />
      <Rows rows={rows} activeRow={activeRow} guides={guides} />
    </div>
  );
}
