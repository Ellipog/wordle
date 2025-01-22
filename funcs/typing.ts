import { Dispatch, SetStateAction } from "react";

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
  setRows: Dispatch<SetStateAction<string[][]>>
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
  setWin: Dispatch<SetStateAction<boolean>>
) => {
  if (e.key === "Enter" && getInput(activeRow, 4)?.innerText !== "") {
    console.log(correctWord, currentWord);
    setGuides((prev) => {
      const remainingLetters = [...correctWord];
      const newGuide = Array(5).fill("r");

      currentWord.forEach((letter, index) => {
        if (letter === correctWord[index]) {
          newGuide[index] = "g";
          remainingLetters[index] = "";
        }
      });

      currentWord.forEach((letter, index) => {
        if (newGuide[index] !== "g") {
          const remainingIndex = remainingLetters.indexOf(letter);
          if (remainingIndex !== -1) {
            newGuide[index] = "o";
            remainingLetters[remainingIndex] = "";
          }
        }
      });

      console.log(activeRow);
      console.log(newGuide);

      if (
        JSON.stringify(newGuide) === JSON.stringify(["g", "g", "g", "g", "g"])
      ) {
        setWin(true);
      } else {
        setActiveRow(activeRow + 1);
        setCurrentIndex(0);
      }

      return [...prev, newGuide];
    });
  }
};
