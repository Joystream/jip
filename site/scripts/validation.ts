import { parsePreamble } from "../lib/preamble";
import { JipId, getAllJipIDs, getJIPDirectory, isStringJipId } from "../lib/files";
import { FileArgument } from "./types";
import { success, warning, info, failure } from "./util";
import path from "path";
import fs from "fs";

// TODO:
// 1. Idea: If there is an argument passed (file) then we validate that file.
//    If not we validate all folders that have the format jip-${number}.

const fileArgument = process.argv[2] as undefined | FileArgument;

const validateFile = (jipId: JipId) => {
  try {
    console.log(info(`Validating file with id: ${jipId}`));

    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");

    parsePreamble(fileContents, { delimiters: ["<pre>", "</pre>"] });

    console.log(success("File successfuly validated, no problems found!"));
  } catch (e) {
    console.log(failure(`There has been a problem while trying to validate this file.\n${e}`));
  }
};

const validateFiles = () => {
  const jipIds = getAllJipIDs();
  for (let jipId of jipIds) {
    validateFile(jipId);
  }
};

const main = async () => {
  if (fileArgument && isStringJipId(fileArgument)) {
    validateFile(fileArgument as JipId);
  } else {
    console.log(
      warning(`No file argument has been passed, testing all conforming files in the root folder!`)
    );
    validateFiles();
  }
};

main();
