import { JipPreamble } from "./jips";

const JOYSTREAM_USER_REGEX = /\[!member\]\(([0-9]+)\)/g;
// const JOYSTREAM_PROPOSAL_REGEX = /\[!proposal\]\(([0-9]+)\)/g;

// const PIONEER_PROPOSALS_LINK = (proposalId: string) => `https://pioneerapp.xyz/#/proposals/preview/${proposalId}`;

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
  const matchedUserIdStrings = usersInput.match(JOYSTREAM_USER_REGEX);

  if (!matchedUserIdStrings) return userIds;

  userIds = matchedUserIdStrings.map(userId => Number(userId.replace(JOYSTREAM_USER_REGEX, "$1")));

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

export const integrateJoystreamLinksIntoHtml = (html: string) => {
  // TODO: Implement joystream link replacement:

  return html;
};
