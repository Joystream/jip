import { parsePreamble } from "../lib/preamble";
import { FileArgument } from "./types";
import { success, warning } from "./util";
import path from "path";
import fs from "fs";

// TODO:
// 1. Idea: If there is an argument passed (file) then we validate that file.
//    If not we validate all folders that have the format jip-${number}.

const fileArgument = process.argv[2] as undefined | FileArgument;
let foundError = false;

const validateFile = (file: string) => {
  try {
    const filePath = path.join(process.cwd(), file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    parsePreamble(fileContents, { delimiters: ["<pre>", "</pre>"] });
  } catch (e) {
    console.log("Error!");

    if (!foundError) foundError = true;
  }
};

const validateFiles = () => {};

const main = async () => {
  if (fileArgument) {
    validateFile(fileArgument);
  } else {
    console.log(
      warning(`No file argument has been passed, testing all conforming files in the root folder!`)
    );
    validateFiles();
  }

  if (!foundError) {
    console.log(success("File(s) successfuly validated, no problems found!"));
  }
};

main();
