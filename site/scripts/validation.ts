import { parsePreamble } from "../lib/preamble";
import { JipId, getAllJipIDs, getJIPDirectory, isStringJipId } from "../lib/files";
import { FileArgument } from "./types";
import { success, warning, info, failure } from "./util";
import fs from "fs";

const fileArgument = process.argv[2] as undefined | FileArgument;

const validateFile = (jipId: JipId) => {
  try {
    console.log(info(`Validating file with id: ${jipId}`));

    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");

    parsePreamble(fileContents, { delimiters: ["<pre>", "</pre>"] });

    console.log(success("File successfuly validated, no problems found!"));
  } catch (e) {
    console.log(failure(`There has been a problem while trying to validate this file.\n${e}`));
    throw e;
  }
};

const validateFiles = () => {
  const jipIds = getAllJipIDs();
  for (let jipId of jipIds) {
    validateFile(jipId);
  }
};

const main = async () => {
  try {
    if (fileArgument && isStringJipId(fileArgument)) {
      validateFile(fileArgument as JipId);
    } else {
      console.log(
        warning(
          `No file argument has been passed, testing all conforming files in the root folder!`
        )
      );
      validateFiles();
    }
  } catch (e) {
    console.log("Error occured, exiting..");

    return -1;
  }

  return 0;
};

main();
