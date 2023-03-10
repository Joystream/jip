import { JipPreamble } from "./validation";

const JOYSTREAM_MEMBER_REGEX = /\[!member\]\(([0-9]+)\)/g;
const JOYSTREAM_PROPOSAL_REGEX = /\[!proposal\]\(([0-9]+)\)/g;
const JOYSTREAM_PROPOSAL_DISCUSSION_REGEX =
  /\[!proposal_discussion\]\(([0-9]+),([0-9]+),([0-9]+)\)/g;
const JOYSTREAM_FORUM_CATEGORY_REGEX = /\[!forum_category\]\(([0-9]+)\)/g;
const JOYSTREAM_FORUM_THREAD__REGEX = /\[!forum_thread\]\(([0-9]+)\)/g;
const JOYSTREAM_FORUM_THREAD_POST_REGEX = /\[!forum_post\]\(([0-9]+),([0-9]+),([0-9]+)\)/g;

const PIONEER_PROPOSAL_LINK = (proposalId: string) =>
  `https://pioneerapp.xyz/#/proposals/preview/${proposalId}`;
const PIONEER_PROPOSAL_DISCUSSION_LINK = (proposalId: string, post: string, revision?: string) =>
  `https://pioneerapp.xyz/#/proposals/preview/${proposalId}?post=${post}`;
const PIONEER_FORUM_CATEGORY_LINK = (categoryId: string) =>
  `https://pioneerapp.xyz/#/forum/category/${categoryId}`;
const PIONEER_FORUM_THREAD_LINK = (threadId: string) =>
  `https://pioneerapp.xyz/#/forum/thread/${threadId}`;
const PIONEER_FORUM_THREAD_POST_LINK = (threadId: string, postId: string, revision?: string) =>
  `https://pioneerapp.xyz/#/forum/thread/${threadId}?post=${postId}`;
const PIONEER_MEMBER_LINK = (memberId: string) => `https://pioneerapp.xyz/#/members/${memberId}`;

const MARKDOWN_LINK_STRING = (link: string, content: string) => `[${content}](${link})`;

const QUERY_URL = "https://query.joystream.org/graphql";
const MEMBER_QUERY_ELEMENT = (memberId: number) => `
  member${memberId}: memberships(where: {id_eq: ${memberId}}) {
    handle
  }
`;

export type MemberQueryResult = {
  [key: string]: [{ handle: string }];
};

const createMultipleUserQuery = (userIds: number[]) => {
  return `
    {
      ${userIds.map(userId => MEMBER_QUERY_ELEMENT(userId))}
    }
  `;
};

export const getUserIdFromUsersString = (usersInput: string) => {
  let userIds: Array<number> = [];
  const matchedUserIdStrings = usersInput.match(JOYSTREAM_MEMBER_REGEX);

  if (!matchedUserIdStrings) return userIds;

  userIds = matchedUserIdStrings.map(userId =>
    Number(userId.replace(JOYSTREAM_MEMBER_REGEX, "$1"))
  );

  return userIds;
};

export const fetchUserHandlesWithIds = async (joystreamIds: number[]) => {
  const memberHandles: Array<string> = [];

  const res = await fetch(QUERY_URL, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ query: createMultipleUserQuery(joystreamIds) })
  });

  if (!res.ok) return memberHandles;

  const { data } = (await res.json()) as { data: MemberQueryResult };

  return Object.values(data).map(([{ handle }]) => handle);
};

export const getAuthorsFromPreamble = async (preamble: JipPreamble) => {
  const userIds = getUserIdFromUsersString(preamble.authors);

  const userHandles = await fetchUserHandlesWithIds(userIds);

  return userHandles;
};

export const integrateJoystreamLinksIntoMarkdown = (markdown: string) => {
  // This matches the form of joystream-related links (defined in the documentation), extracts the
  // necessary id (multiple if necessary) and inserts them into a link which is the further integrated
  // into the markdown itself.

  return markdown
    .replace(JOYSTREAM_PROPOSAL_REGEX, MARKDOWN_LINK_STRING(PIONEER_PROPOSAL_LINK("$1"), "$1"))
    .replace(
      JOYSTREAM_PROPOSAL_DISCUSSION_REGEX,
      MARKDOWN_LINK_STRING(PIONEER_PROPOSAL_DISCUSSION_LINK("$1", "$2"), `${"$1"}/${"$2"}`)
    )
    .replace(
      JOYSTREAM_FORUM_CATEGORY_REGEX,
      MARKDOWN_LINK_STRING(PIONEER_FORUM_CATEGORY_LINK("$1"), "$1")
    )
    .replace(
      JOYSTREAM_FORUM_THREAD__REGEX,
      MARKDOWN_LINK_STRING(PIONEER_FORUM_THREAD_LINK("$1"), "$1")
    )
    .replace(
      JOYSTREAM_FORUM_THREAD_POST_REGEX,
      MARKDOWN_LINK_STRING(PIONEER_FORUM_THREAD_POST_LINK("$1", "$2"), `${"$1"}/${"$2"}`)
    )
    .replace(JOYSTREAM_MEMBER_REGEX, MARKDOWN_LINK_STRING(PIONEER_MEMBER_LINK("$1"), "$1"));
};
