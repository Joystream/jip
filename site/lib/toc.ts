const TOC_HEADINGS_REGEX = /<h[1-3]>.*<\/h[1-3]>/g;
const ALL_HEADINGS_REGEX = /<h[1-6]>.*<\/h[1-6]>/g;
const ANY_HTML_TAG_REGEX = /<\/?[^>]+(>|$)/g;

const generateContentAndLinkFromHeading = (heading: string) => {
  const content = heading.substring(4, heading.length - 5);
  const contentWithRemovedHTML = content.replace(ANY_HTML_TAG_REGEX, "");

  return {
    content: contentWithRemovedHTML,
    link: contentWithRemovedHTML.toLowerCase().replace(/ /g, "-")
  };
};

export type BaseTocItem = { content: string; link: string };
export type TOCItems = Array<
  { children: Array<{ children: Array<BaseTocItem> } & BaseTocItem> } & BaseTocItem
>;

export const createTOCFromHTML = (html: string) => {
  const mainHeadings = html.match(TOC_HEADINGS_REGEX);

  const toc: TOCItems = [];

  if (mainHeadings == null) return toc;

  let lastH1 = "";
  let lastH2 = "";
  for (let mainHeading of mainHeadings) {
    const { content, link } = generateContentAndLinkFromHeading(mainHeading);

    if (mainHeading[2] == "1") {
      toc.push({
        children: [],
        content,
        link
      });
      lastH1 = link;
    }

    if (mainHeading[2] == "2") {
      toc
        .find(h1 => h1.link == lastH1)
        ?.children.push({
          children: [],
          content,
          link
        });
      lastH2 = link;
    }

    if (mainHeading[2] == "3") {
      toc
        .find(h1 => h1.link == lastH1)
        ?.children.find(h2 => h2.link == lastH2)
        ?.children.push({
          content,
          link
        });
    }
  }

  return toc;
};

export const integrateTOCLinksIntoHtml = (html: string) => {
  return html.replace(ALL_HEADINGS_REGEX, match => {
    const { link } = generateContentAndLinkFromHeading(match);

    return match.substring(0, 3) + ` id="${link}"` + match.substring(3);
  });
};
