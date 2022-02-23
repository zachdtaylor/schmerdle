import words from "./words.json";

export default words;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function searchRandomWord(length: number) {
  const startIndex = getRandomInt(0, words.length - 20);
  const slice = words.slice(startIndex, startIndex + 20);
  const word = slice.find((word) => word.length === length);
  if (typeof word === "undefined") {
    return "";
  }
  return word;
}

export function getRandomWord(length: number) {
  let word = "";
  while (word.length !== length) {
    word = searchRandomWord(length);
  }
  return word;
}
