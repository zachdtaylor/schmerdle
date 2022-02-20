export const backspaceCode = 8;
export const enterCode = 13;

export function isLetter(c: string) {
  return c.length === 1 && /[a-zA-Z]/.test(c);
}
export function classNames(...names: Array<string | undefined>) {
  const reduced = names.reduce(
    (acc, name) => (name ? `${acc} ${name}` : acc),
    ""
  );
  return reduced || "";
}
