import wordListNb from "./word_list_nb.json";
import validWordListNb from "./valid_word_list_nb.json";
interface WordList {
  words: string[];
}

export const words = (wordListNb as WordList).words.filter(
  (word) => word.length === 5
);

export const validWords = (validWordListNb as WordList).words.filter(
  (word) => word.length === 5
);
