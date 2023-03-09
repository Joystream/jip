const H1_AND_H2_REGEX = /<h[1-2]>.*<\/h[1-2]>/g;

export const createTOCFromHTML = (html: string) => {
  // Extract all the h1 and h2's for the TOC
  const mainHeadings = html.match(H1_AND_H2_REGEX);

  const toc: { [key: string]: string[] } = {};

  if (mainHeadings == null) return toc;

  let lastH1 = "";
  for (let mainHeading of mainHeadings) {
    const headingContent = mainHeading.substring(4, mainHeading.length - 5);

    if (mainHeading[2] == "1") {
      toc[headingContent] = [];
      lastH1 = headingContent;
    }

    if (mainHeading[2] == "2") {
      toc[lastH1].push(headingContent);
    }
  }

  return toc;
};

export const integrateTOCLinksIntoHtml = (html: string) => {
  return html.replace(H1_AND_H2_REGEX, match => {
    const headingContent = match.substring(4, match.length - 5);

    return match.substring(0, 3) + ` id="${headingContent}"` + match.substring(3);
  });
};
