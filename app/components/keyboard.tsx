import React from "react";
import { GameState } from "~/utils/game";
import { classNames } from "~/utils/misc";

function getSets(gameState: GameState) {
  const absent = new Set();
  const present = new Set();
  const correct = new Set();

  gameState.pastGuesses.forEach((guess) => {
    guess.forEach((letterGuess) => {
      if (letterGuess.evaluation === "absent") {
        absent.add(letterGuess.value.toLowerCase());
      } else if (letterGuess.evaluation === "present") {
        present.add(letterGuess.value.toLowerCase());
      } else if (letterGuess.evaluation === "correct") {
        correct.add(letterGuess.value.toLowerCase());
      }
    });
  });

  return { absent, present, correct };
}

function useKeyStatus(gameState: GameState) {
  const { absent, present, correct } = React.useMemo(
    () => getSets(gameState),
    [gameState]
  );

  return (key: string) =>
    correct.has(key)
      ? "correct"
      : present.has(key)
      ? "present"
      : absent.has(key)
      ? "absent"
      : null;
}

export function Keyboard({
  gameState,
  onClick,
}: {
  gameState: GameState;
  onClick: (key: string) => void;
}) {
  const keyStatus = useKeyStatus(gameState);

  return (
    <div>
      <KeyboardRow>
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((value) => (
          <KeyboardKey
            key={value}
            onClick={onClick}
            className="w-[10%]"
            status={keyStatus(value)}
          >
            {value}
          </KeyboardKey>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((value) => (
          <KeyboardKey
            key={value}
            onClick={onClick}
            className="w-[10%]"
            status={keyStatus(value)}
          >
            {value}
          </KeyboardKey>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {["enter", "z", "x", "c", "v", "b", "n", "m", "back"].map((value) => (
          <KeyboardKey
            key={value}
            onClick={onClick}
            className="flex-auto"
            status={keyStatus(value)}
          >
            {value}
          </KeyboardKey>
        ))}
      </KeyboardRow>
    </div>
  );
}

function KeyboardRow({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}

function KeyboardKey({
  status,
  children,
  onClick,
  className,
}: {
  status: "absent" | "present" | "correct" | null;
  children: string;
  onClick: (key: string) => void;
  className?: string;
}) {
  return (
    <button
      className={classNames(
        "h-10 bg-gray-200 rounded-md m-1",
        "flex flex-col justify-center",
        status === "absent" ? "bg-gray-600 text-white" : "",
        status === "present" ? "bg-yellow-500 text-white" : "",
        status === "correct" ? "bg-green-600 text-white" : "",
        className
      )}
      onClick={() => onClick(children)}
    >
      <span className="w-full text-center">{children}</span>
    </button>
  );
}
