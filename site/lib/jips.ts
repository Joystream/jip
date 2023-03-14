import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { createTOCFromHTML, integrateTOCLinksIntoHtml, TOCItems } from "./toc";
import { parsePreamble } from "./preamble";
import { integrateJoystreamLinksIntoMarkdown } from "./joystream";
import { JipPreamble } from "./validation";
import remarkGfm from "remark-gfm";

export const JIP_FOLDER_IDENTIFIER = "jip-";
export type JipId = `${typeof JIP_FOLDER_IDENTIFIER}${number}`;

export type BaseJipData = { jipId: JipId; preamble: JipPreamble };
export type JipData = BaseJipData & {
  contentHtml: string;
  toc: TOCItems;
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

  const { preamble, content } = parsePreamble(fileContents, {
    delimiters: ["<pre>", "</pre>"]
  });

  const contentHtml = (
    await remark()
      .use(html, { sanitize: true })
      .use(remarkGfm)
      .process(integrateJoystreamLinksIntoMarkdown(content))
  ).toString();

  const toc = createTOCFromHTML(contentHtml);
  const htmlWithTOCLinks = integrateTOCLinksIntoHtml(contentHtml);

  return {
    jipId,
    contentHtml: htmlWithTOCLinks,
    preamble,
    toc: toc
  };
};

const getAllJipsPreambleData = () => {
  const allJipIds = getAllJipIDs();

  const allPostsData = allJipIds.map(jipId => {
    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");
    const { preamble } = parsePreamble(fileContents, {
      delimiters: ["<pre>", "</pre>"]
    });

    return {
      jipId,
      preamble
    };
  });

  return allPostsData;
};

export { getAllJipIDs, getJipData, getAllJipsPreambleData };
