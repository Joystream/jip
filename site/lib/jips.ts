import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { createTOCFromHTML, integrateTOCLinksIntoHtml } from "./toc";
import { parsePreamble } from "./preamble";

export type JipId = `jip-${number}`;

export type JipPreamble = {
  jip: string;
  title: string;
  authors: string;
  owners?: string;
  type: "Community" | "Council";
  category: "Hard-fork" | "Recovery" | "Meta" | "Informational" | "Standard";
  domains?: "string";
  description: string;
  forumThread: string;
  stage: "Draft" | "Review" | "Living" | "Stagnant" | "Last Call" | "Withdrawn" | "Enactable" | "Final" | "Rejected" | "Enacted";
  lastCallDeadline: "string";
  created: string;
  requires?: string;
  proposals?: string
}

export type JipData = {
  jipId: JipId;
  contentHtml: string;
  preamble: JipPreamble;
  toc: { [key : string] : Array<string> }
}

const JIP_FOLDER_IDENTIFIER = "jip-";

const getJIPDirectory = (jipId: JipId) =>
  path.join(process.cwd(), `../${jipId}/jip.md`);

const getAllJipIDs = () => {
  const rootFolder = path.join(process.cwd(), "..");
  const rootFolderJIPs = fs
    .readdirSync(rootFolder)
    .filter(itemName =>
      itemName.includes(JIP_FOLDER_IDENTIFIER)
    ) as Array<JipId>;

  return rootFolderJIPs;
}

const getJipData = async (jipId: JipId) => {
  const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");

  const { preamble, content } = parsePreamble(fileContents, { delimiters: ["<pre>" , "</pre>"]})

  const contentHtml = (await remark()
    .use(html, { sanitize: true })
    .process(content)).toString();
  
  const toc = createTOCFromHTML(contentHtml);
  const htmlWithTOCLinks = integrateTOCLinksIntoHtml(contentHtml);

  return {
    jipId,
    contentHtml: htmlWithTOCLinks,
    preamble: preamble as JipPreamble,
    toc: toc
  }
}

const getAllJipsPreambleData = () => {
  const allJipIds = getAllJipIDs();

  const allPostsData = allJipIds.map((jipId) => {
    const fileContents = fs.readFileSync(getJIPDirectory(jipId), 'utf8');
    const { preamble } = parsePreamble(fileContents, { delimiters: ["<pre>", "</pre>"]});

    return {
      jipId,
      preamble: preamble as JipPreamble,
    };
  });

  return allPostsData;
}

export { getAllJipIDs, getJipData, getAllJipsPreambleData } 
