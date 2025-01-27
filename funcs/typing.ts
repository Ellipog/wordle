import { LetterStatus } from "@/app/page";
import { Dispatch, SetStateAction } from "react";
import { words } from "@/lib/words";

export const getInput = (rowIndex: number, columnIndex: number) => {
  return document.querySelector<HTMLInputElement>(
    `div[data-row="${rowIndex}"][data-column="${columnIndex}"]`
  );
};

export const handleKeyDown = (
  e: KeyboardEvent,
  currentIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  activeRow: number,
  setRows: Dispatch<SetStateAction<string[][]>>,
  letterStatuses: LetterStatus,
  hardMode: boolean
) => {
  const currentInput = getInput(activeRow, currentIndex);
  const previousInput = getInput(activeRow, currentIndex - 1);
  const nextInput = getInput(activeRow, currentIndex + 1);

  if (e.key === "Backspace") {
    if (currentInput) {
      if (currentInput.innerText !== "") {
        currentInput.innerText = "";
        setRows((prev) => {
          const newRows = [...prev];
          newRows[activeRow][currentIndex] = "";
          return newRows;
        });
      } else if (previousInput) {
        setCurrentIndex(currentIndex - 1);
        previousInput.innerText = "";
        setRows((prev) => {
          const newRows = [...prev];
          newRows[activeRow][currentIndex - 1] = "";
          return newRows;
        });
      }
    }
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    if (hardMode && letterStatuses[e.key.toLowerCase()] === "wrong") {
      return;
    }

    if (currentInput && currentIndex < 5 && currentInput.innerText === "") {
      currentInput.innerText = e.key;
      setRows((prev) => {
        const newRows = [...prev];
        newRows[activeRow][currentIndex] = e.key.toLowerCase();
        return newRows;
      });
      if (nextInput) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  }
};

export const handleEnterDown = (
  e: KeyboardEvent,
  correctWord: string[],
  currentWord: string[],
  setGuides: Dispatch<SetStateAction<string[][]>>,
  activeRow: number,
  setActiveRow: Dispatch<SetStateAction<number>>,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  setWin: Dispatch<SetStateAction<string>>,
  setLetterStatuses: Dispatch<SetStateAction<LetterStatus>>,
  hardMode: boolean,
  guides: string[][],
  previousWord: string[],
  letterStatuses: LetterStatus,
  setError?: Dispatch<SetStateAction<string>>
) => {
  if (e.key === "Enter" && getInput(activeRow, 4)?.innerText !== "") {
    const guessedWord = currentWord.join("");

    // Check if word exists in word list
    if (!words.includes(guessedWord)) {
      setError?.("Word not in word list");
      return;
    }

    if (hardMode) {
      const validation = validateHardMode(
        currentWord,
        guides,
        previousWord,
        letterStatuses
      );
      if (!validation.valid) {
        setError?.(validation.error);
        return;
      }
    }

    setGuides((prev) => {
      const remainingLetters = [...correctWord];
      const newGuide = Array(5).fill("r");

      // First pass: find correct letters
      currentWord.forEach((letter, index) => {
        if (letter === correctWord[index]) {
          newGuide[index] = "g";
          remainingLetters[index] = "";
          setLetterStatuses((prev) => ({ ...prev, [letter]: "correct" }));
        }
      });

      // Second pass: find present letters
      currentWord.forEach((letter, index) => {
        if (newGuide[index] !== "g") {
          const remainingIndex = remainingLetters.indexOf(letter);
          if (remainingIndex !== -1) {
            newGuide[index] = "o";
            remainingLetters[remainingIndex] = "";
            setLetterStatuses((prev) => ({
              ...prev,
              [letter]: prev[letter] !== "correct" ? "present" : prev[letter],
            }));
          } else {
            setLetterStatuses((prev) => ({
              ...prev,
              [letter]: prev[letter] === "unused" ? "wrong" : prev[letter],
            }));
          }
        }
      });

      if (newGuide.every((g) => g === "g")) {
        setWin("win");
      } else if (activeRow === 5) {
        setWin("lose");
      } else {
        setActiveRow(activeRow + 1);
        setCurrentIndex(0);
      }

      return [...prev, newGuide];
    });
  }
};

export const validateHardMode = (
  currentWord: string[],
  guides: string[][],
  previousWord: string[],
  letterStatuses: LetterStatus
): { valid: boolean; error: string } => {
  if (guides.length === 0) return { valid: true, error: "" };

  const lastGuide = guides[guides.length - 1];
  const lastWord = previousWord;

  // Check if correct letters are in same position
  for (let i = 0; i < lastGuide.length; i++) {
    if (lastGuide[i] === "g" && currentWord[i] !== lastWord[i]) {
      return {
        valid: false,
        error: `The letter "${lastWord[i].toUpperCase()}" must be in position ${
          i + 1
        }. Keep green letters in place!`,
      };
    }
  }

  // Check if present letters are included somewhere
  const presentLetters = lastWord.filter((letter, i) => lastGuide[i] === "o");
  for (const letter of presentLetters) {
    if (!currentWord.includes(letter)) {
      return {
        valid: false,
        error: `Your guess must include the letter "${letter.toUpperCase()}" since it's in the word!`,
      };
    }
  }

  // Check if wrong letters are not used
  for (const [letter, status] of Object.entries(letterStatuses)) {
    if (status === "wrong" && currentWord.includes(letter)) {
      return {
        valid: false,
        error: `The letter "${letter.toUpperCase()}" is not in the word. Try a different letter!`,
      };
    }
  }

  return { valid: true, error: "" };
};
