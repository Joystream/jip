import { validatePreamble } from "./validation";

const kebabCaseToCamelCase = (kebabCaseString: string) =>
  kebabCaseString.replace(/-./g, (x: string) => x[1].toUpperCase());

export const parsePreamble = (file: string, { delimiters }: { delimiters: [string, string] }) => {
  const fileLines = file.split("\n");

  const indexOfFirstDelimiter = fileLines.indexOf(delimiters[0]);
  const indexOfSecondDelimiter = fileLines.indexOf(delimiters[1]);

  const preambleLines = fileLines.slice(indexOfFirstDelimiter + 1, indexOfSecondDelimiter);
  const content = fileLines.slice(indexOfSecondDelimiter + 1).join("\n");

  const unvalidatedPreamble = preambleLines.reduce((prev: { [key: string]: any }, curr) => {
    const [key, value] = curr.split(":").map(val => val.trim());

    prev[kebabCaseToCamelCase(key)] = value;

    return prev;
  }, {});

  const preamble = validatePreamble(unvalidatedPreamble);

  return {
    preamble,
    content
  };
};
