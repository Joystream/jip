import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { createTOCFromHTML, integrateTOCLinksIntoHtml } from "@/lib/toc";

export type JipId = `jip-${number}`;

export type JipPreamble = {
  jip: number;
  title: string;
  authors: string;
  owners?: string;
  type: "Community" | "Council";
  category: "Hard-fork" | "Recovery" | "Meta" | "Informational" | "Standard";
  domains?: "string";
  description: string;
  "forum-thread": string;
  stage: "Draft" | "Review" | "Living" | "Stagnant" | "Last Call" | "Withdrawn" | "Enactable" | "Final" | "Rejected" | "Enacted";
  "last-call-deadline": "string";
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
  const matterResult = matter(fileContents, {
    delimiters: ["<pre>", "</pre>"]
  });

  const contentHtml = (await remark()
    .use(html, { sanitize: true })
    .process(matterResult.content)).toString();
  
  const toc = createTOCFromHTML(contentHtml);
  const htmlWithTOCLinks = integrateTOCLinksIntoHtml(contentHtml);

  return {
    jipId,
    contentHtml: htmlWithTOCLinks,
    preamble: matterResult.data as JipPreamble,
    toc: toc
  }
}

const getAllJipsPreambleData = () => {
  const allJipIds = getAllJipIDs();

  const allPostsData = allJipIds.map((jipId) => {
    const fileContents = fs.readFileSync(getJIPDirectory(jipId), 'utf8');
    const matterResult = matter(fileContents, { delimiters: ["<pre>", "</pre>"]});

    return {
      jipId,
      preamble: matterResult.data as JipPreamble,
    };
  });

  return allPostsData;
}

export { getAllJipIDs, getJipData, getAllJipsPreambleData } 
