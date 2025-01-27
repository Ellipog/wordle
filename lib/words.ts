import wordListNb from "./word_list_nb.json";

interface WordList {
  words: string[];
}

export const words = (wordListNb as WordList).words.filter(
  (word) => word.length === 5
);
