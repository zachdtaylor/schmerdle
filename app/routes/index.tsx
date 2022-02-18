import { fetch } from "@remix-run/node";
import React from "react";
import { LoaderFunction, useLoaderData } from "remix";

const allowedGuesses = 6;
const wordLength = 5;
const backspaceCode = 8;
const enterCode = 13;

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

async function getNLetterWord(n: number) {
  let word = "";
  while (word.length !== n) {
    word = await searchNLetterWord(n);
  }
  return word;
}

export const loader: LoaderFunction = async () => {
  return getNLetterWord(wordLength);
};

const initialState = {
  pastGuesses: [],
  currentGuess: [],
};

const events = {
  ADD_LETTER: "ADD_LETTER",
  REMOVE_LETTER: "REMOVE_LETTER",
  SUBMIT_GUESS: "SUBMIT_GUESS",
};

function appReducer(state: any, event: any) {
  switch (event.type) {
    case events.ADD_LETTER: {
      if (state.currentGuess.length === wordLength) {
        return state;
      }
      const currentGuess = state.currentGuess;
      currentGuess.push(event.payload);
      return { ...state, currentGuess };
    }
    case events.REMOVE_LETTER: {
      const currentGuess = state.currentGuess;
      currentGuess.pop();
      return {
        ...state,
        currentGuess,
      };
    }
    case events.SUBMIT_GUESS: {
      if (state.currentGuess.length === wordLength) {
        return {
          ...state,
          currentGuess: [],
          pastGuesses: [...state.pastGuesses, state.currentGuess],
        };
      }
      return state;
    }
  }
}

function isLetter(c: string) {
  return c.length === 1 && /[a-zA-Z]/.test(c);
}

export default function Index() {
  const word = useLoaderData();
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      const char = String.fromCharCode(event.keyCode);
      if (isLetter(char)) {
        return dispatch({ type: events.ADD_LETTER, payload: char });
      }
      if (event.keyCode === backspaceCode) {
        return dispatch({ type: events.REMOVE_LETTER });
      }
      if (event.keyCode === enterCode) {
        return dispatch({ type: events.SUBMIT_GUESS });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div>
      {state.pastGuesses.map((guess: string[], idx: number) => (
        <WordRow key={idx}>
          {guess.map((char, idx) => (
            <LetterBox key={idx}>{char}</LetterBox>
          ))}
        </WordRow>
      ))}
      <WordRow>
        {state.currentGuess.map((char: string, idx: number) => (
          <LetterBox key={idx}>{char}</LetterBox>
        ))}
      </WordRow>
    </div>
  );
}

function WordRow({ children }: { children: React.ReactNode }) {
  return <div className="flex">{children}</div>;
}

function LetterBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-2 border-gray-200 rounded-md p-4 mx-2">
      {children}
    </div>
  );
}
