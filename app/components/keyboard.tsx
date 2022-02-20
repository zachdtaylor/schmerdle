import React from "react";
import { classNames } from "~/utils/misc";

export function Keyboard({ onClick }: { onClick: (key: string) => void }) {
  return (
    <div>
      <KeyboardRow>
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((value) => (
          <KeyboardKey key={value} onClick={onClick}>
            {value}
          </KeyboardKey>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((value) => (
          <KeyboardKey key={value} onClick={onClick}>
            {value}
          </KeyboardKey>
        ))}
      </KeyboardRow>
      <KeyboardRow>
        {["enter", "z", "x", "c", "v", "b", "n", "m", "back"].map((value) => (
          <KeyboardKey key={value} onClick={onClick}>
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
  children,
  onClick,
}: {
  children: string;
  onClick: (key: string) => void;
}) {
  return (
    <button
      className={classNames(
        "h-8 p-2 bg-gray-200 rounded-md m-1",
        "flex flex-col justify-center"
      )}
      onClick={() => onClick(children)}
    >
      {children}
    </button>
  );
}
