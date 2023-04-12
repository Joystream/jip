import fs from "fs";
import { remark } from "remark";
import html from "remark-html";
import { createTOCFromHTML, integrateTOCLinksIntoHtml, TOCItems } from "./toc";
import { parsePreamble } from "./preamble";
import { integrateJoystreamLinksIntoMarkdown } from "./joystream";
import { JipPreamble } from "./validation";
import { getJIPDirectory, getAllJipIDs, JipId } from "./files";
import remarkGfm from "remark-gfm";

export type BaseJipData = { jipId: JipId; preamble: JipPreamble };
export type JipData = BaseJipData & {
  contentHtml: string;
  toc: TOCItems;
};

const getJipData = async (jipId: JipId) => {
  const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");

  const { preamble, content } = parsePreamble(fileContents, {
    delimiters: ["<pre>", "</pre>"],
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
    toc: toc,
  };
};

const getAllJipsPreambleData = () => {
  const allJipIds = getAllJipIDs();

  const allPostsData = allJipIds.map((jipId) => {
    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");
    const { preamble } = parsePreamble(fileContents, {
      delimiters: ["<pre>", "</pre>"],
    });

    return {
      jipId,
      preamble,
    };
  });

  return allPostsData;
};

export { getAllJipIDs, getJipData, getAllJipsPreambleData, getJIPDirectory };
