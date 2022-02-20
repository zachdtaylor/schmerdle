import React from "react";
import { LoaderFunction, useLoaderData } from "remix";
import { useGame } from "~/utils/game";
import { getNLetterWord } from "~/utils/words";
import { isLetter, backspaceCode, enterCode } from "~/utils/misc";
import { Keyboard } from "~/components/keyboard";

export const loader: LoaderFunction = async () => {
  const wordLength = 5;
  const allowedGuesses = 6;
  return { word: await getNLetterWord(wordLength), wordLength, allowedGuesses };
};

export default function Index() {
  const { word, wordLength, allowedGuesses } = useLoaderData();
  const game = useGame(word, wordLength, allowedGuesses);
  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      const char = String.fromCharCode(event.keyCode);
      if (isLetter(char)) {
        return game.addLetter(char);
      }
      if (event.keyCode === backspaceCode) {
        return game.removeLetter();
      }
      if (event.keyCode === enterCode) {
        return game.submitGuess();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="flex justify-center">
      <div>
        <div className="mb-8">
          {Array.from(Array(allowedGuesses)).map((_, idx) => {
            const word =
              idx < game.state.pastGuesses.length
                ? game.state.pastGuesses[idx]
                : idx === game.state.pastGuesses.length
                ? game.state.currentGuess
                : [];
            return (
              <WordRow key={idx}>
                {Array.from(Array(wordLength)).map((_, widx) => (
                  <LetterBox key={widx} status={word[widx]?.evaluation}>
                    {word[widx]?.value}
                  </LetterBox>
                ))}
              </WordRow>
            );
          })}
        </div>
        <Keyboard
          onClick={(key) =>
            key === "enter"
              ? game.submitGuess()
              : key === "back"
              ? game.removeLetter()
              : game.addLetter(key)
          }
        />
      </div>
    </div>
  );
}

function WordRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex my-2 gap-2 text-center text-xl font-bold justify-center">
      {children}
    </div>
  );
}

function LetterBox({
  children,
  status,
}: {
  children?: React.ReactNode;
  status: "absent" | "present" | "correct" | null;
}) {
  return (
    <div
      className={`border-2 border-gray-200 rounded-md p-4 w-14 h-14 uppercase ${
        status === "correct"
          ? "bg-green-600 text-white border-green-600"
          : status === "present"
          ? "bg-yellow-500 text-white border-yellow-500"
          : status === "absent"
          ? "bg-gray-600 text-white border-gray-600"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
