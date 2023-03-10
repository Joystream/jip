import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { createTOCFromHTML, integrateTOCLinksIntoHtml } from "./toc";
import { parsePreamble } from "./preamble";
import { integrateJoystreamLinksIntoHtml } from "./joystream";
import { JipPreamble, validatePreamble } from "./validation";

export const JIP_FOLDER_IDENTIFIER = "jip-";
export type JipId = `${typeof JIP_FOLDER_IDENTIFIER}${number}`;

export type JipData = {
  jipId: JipId;
  contentHtml: string;
  preamble: JipPreamble;
  toc: { [key: string]: Array<string> };
};

const getJIPDirectory = (jipId: JipId) => path.join(process.cwd(), `../${jipId}/jip.md`);

const getAllJipIDs = () => {
  const rootFolder = path.join(process.cwd(), "..");
  const rootFolderJIPs = fs
    .readdirSync(rootFolder)
    .filter(itemName => itemName.includes(JIP_FOLDER_IDENTIFIER)) as Array<JipId>;

  return rootFolderJIPs;
};

const getJipData = async (jipId: JipId) => {
  const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");

  const { unvalidatedPreamble, content } = parsePreamble(fileContents, {
    delimiters: ["<pre>", "</pre>"]
  });
  const validatedPreamble = validatePreamble(unvalidatedPreamble);

  const contentHtml = (await remark().use(html, { sanitize: true }).process(content)).toString();

  const toc = createTOCFromHTML(contentHtml);
  const htmlWithTOCLinks = integrateTOCLinksIntoHtml(contentHtml);
  const finalHtml = integrateJoystreamLinksIntoHtml(htmlWithTOCLinks);

  return {
    jipId,
    contentHtml: finalHtml,
    preamble: validatedPreamble,
    toc: toc
  };
};

const getAllJipsPreambleData = () => {
  const allJipIds = getAllJipIDs();

  const allPostsData = allJipIds.map(jipId => {
    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");
    const { unvalidatedPreamble } = parsePreamble(fileContents, {
      delimiters: ["<pre>", "</pre>"]
    });
    const validatedPreamble = validatePreamble(unvalidatedPreamble);

    return {
      jipId,
      preamble: validatedPreamble
    };
  });

  return allPostsData;
};

export { getAllJipIDs, getJipData, getAllJipsPreambleData };
