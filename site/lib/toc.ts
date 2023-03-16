const TOC_HEADINGS_REGEX = /<h[1-3]>.*<\/h[1-3]>/g;
const ALL_HEADINGS_REGEX = /<h[1-6]>.*<\/h[1-6]>/g;
const ANY_HTML_TAG_REGEX = /<\/?[^>]+(>|$)/g;

const generateLinkValue = (baseLinkValue: string, counter: number) => {
  if (counter === 0) return baseLinkValue;

  return `${baseLinkValue}-${counter}`;
};

const generateContentAndLinkFromHeading = (heading: string, linkValueTracker: Array<string>) => {
  let counter = 0;
  const content = heading.substring(4, heading.length - 5).replace(ANY_HTML_TAG_REGEX, "");
  const baseLinkValue = content.toLowerCase().replace(/ /g, "-");

  while (
    linkValueTracker.find(linkValue => linkValue === generateLinkValue(baseLinkValue, counter))
  ) {
    counter++;
  }

  const link = generateLinkValue(baseLinkValue, counter);
  linkValueTracker.push(link);

  return {
    content,
    link
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
  let usedLinkValues: Array<string> = [];
  for (let mainHeading of mainHeadings) {
    const { content, link } = generateContentAndLinkFromHeading(mainHeading, usedLinkValues);

    if (mainHeading[2] == "1") {
      toc.push({
        children: [],
        content,
        link
      });
      lastH1 = link;
    }

    const h1Items = toc.find(h1 => h1.link === lastH1);
    if (mainHeading[2] == "2" && h1Items) {
      h1Items.children.push({
        children: [],
        content,
        link
      });
      lastH2 = link;
    }

    const h2Items = h1Items?.children.find(h2 => h2.link === lastH2);
    if (mainHeading[2] == "3" && h2Items) {
      h2Items.children.push({
        content,
        link
      });
    }
  }

  return toc;
};

export const integrateTOCLinksIntoHtml = (html: string) => {
  let usedLinkValues: Array<string> = [];

  return html.replace(ALL_HEADINGS_REGEX, match => {
    const { link } = generateContentAndLinkFromHeading(match, usedLinkValues);

    return match.substring(0, 3) + ` id="${link}"` + match.substring(3);
  });
};
