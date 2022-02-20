async function searchNLetterWord(n: number) {
  const response = await fetch(
    "https://random-word-api.herokuapp.com/word?number=10"
  );
  const words: string[] = await response.json();
  const word = words.find((w) => w.length === n);
  if (typeof word === "undefined") {
    return "";
  }
  return word;
}

export async function getNLetterWord(n: number) {
  let word = "";
  while (word.length !== n) {
    word = await searchNLetterWord(n);
  }
  return word;
}
