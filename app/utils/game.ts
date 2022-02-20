import React, { Reducer } from "react";

type LetterGuess = {
  value: string;
  evaluation: "correct" | "present" | "absent" | null;
};

type WordGuess = Array<LetterGuess>;

const initialState = {
  pastGuesses: [] as Array<WordGuess>,
  currentGuess: [] as WordGuess,
  word: "",
  allowedGuesses: 6,
  wordLength: 5,
  gameState: "playing" as "playing" | "lost" | "won",
};

export type GameState = typeof initialState;

const events = {
  ADD_LETTER: "ADD_LETTER",
  REMOVE_LETTER: "REMOVE_LETTER",
  SUBMIT_GUESS: "SUBMIT_GUESS",
} as const;

type Event = {
  type: keyof typeof events;
  payload?: any;
};

function evaluate(guess: WordGuess, w: string) {
  let word = w.toLowerCase();
  const wordLength = word.length;
  if (guess.length !== wordLength) {
    throw new Error("cannot evaluate: guess and word are not the same length");
  }

  let evaluated: WordGuess = guess;

  // Pass 1: check for correct letters
  evaluated = evaluated.map((letterGuess, idx) => {
    const letter = letterGuess.value.toLowerCase();
    if (word[idx] === letter) {
      return { ...letterGuess, evaluation: "correct" };
    }
    return letterGuess;
  });

  let leftoverWord = word
    .split("")
    .filter((_, idx) => evaluated[idx].evaluation === null)
    .join("");

  // Pass 2: check for present letters
  evaluated = evaluated.map((letterGuess, idx) => {
    const letter = letterGuess.value.toLowerCase();
    if (letterGuess.evaluation === null) {
      if (leftoverWord.includes(letter)) {
        leftoverWord = leftoverWord.replace(letter, "");
        return { ...letterGuess, evaluation: "present" };
      } else {
        return { ...letterGuess, evaluation: "absent" };
      }
    }
    return letterGuess;
  });
  return evaluated;
}

function isCorrectGuess(guess: WordGuess) {
  return guess.reduce(
    (isCorrect, letterGuess) =>
      isCorrect && letterGuess.evaluation === "correct",
    true
  );
}

const appReducer: Reducer<GameState, Event> = (state, event) => {
  if (state.gameState === "playing") {
    switch (event.type) {
      case events.ADD_LETTER: {
        if (
          state.pastGuesses.length === state.allowedGuesses ||
          state.currentGuess.length === state.wordLength
        ) {
          return state;
        }
        const currentGuess = state.currentGuess;
        currentGuess.push({ value: event.payload, evaluation: null });
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
        if (
          state.pastGuesses.length < state.allowedGuesses &&
          state.currentGuess.length === state.wordLength
        ) {
          const evaluatedGuess = evaluate(state.currentGuess, state.word);
          const isCorrect = isCorrectGuess(evaluatedGuess);
          return {
            ...state,
            gameState: isCorrect
              ? "won"
              : !isCorrect &&
                state.pastGuesses.length === state.allowedGuesses - 1
              ? "lost"
              : "playing",
            currentGuess: [],
            pastGuesses: [...state.pastGuesses, evaluatedGuess],
          };
        }
        return state;
      }
    }
  }
  return state;
};

export function useGame(
  word: string,
  wordLength: number,
  allowedGuesses: number
) {
  const [state, dispatch] = React.useReducer(appReducer, {
    ...initialState,
    word,
    wordLength,
    allowedGuesses,
  });
  return {
    state,
    addLetter: (char: string) =>
      dispatch({ type: events.ADD_LETTER, payload: char }),
    removeLetter: () => dispatch({ type: events.REMOVE_LETTER }),
    submitGuess: () => dispatch({ type: events.SUBMIT_GUESS }),
  };
}
