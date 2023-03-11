import { describe, it, expect } from "vitest";
import { integrateJoystreamLinksIntoMarkdown } from "../lib/joystream";

describe.concurrent("Joystream on-chain to markdown lint integration", () => {
  it("should correctly convert jip-specific proposal notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!proposal](191)")).toBe(
      "[191](https://pioneerapp.xyz/#/proposals/preview/191)"
    );
  });

  it("should correctly convert jip-specific proposal discussion notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!proposal_discussion](191,282,0)")).toBe(
      "[191/282](https://pioneerapp.xyz/#/proposals/preview/191?post=282)"
    );
  });

  it("should correctly convert jip-specific forum category notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!forum_category](7)")).toBe(
      "[7](https://pioneerapp.xyz/#/forum/category/7)"
    );
  });

  it("should correctly convert jip-specific forum thread notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!forum_thread](293)")).toBe(
      "[293](https://pioneerapp.xyz/#/forum/thread/293)"
    );
  });

  it("should correctly convert jip-specific forum post notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!forum_post](276,1247,0)")).toBe(
      "[276/1247](https://pioneerapp.xyz/#/forum/thread/276?post=1247)"
    );
  });

  it("should correctly convert jip-specific member notation to correct on-chain link", () => {
    expect(integrateJoystreamLinksIntoMarkdown("[!member](151)")).toBe(
      "[151](https://pioneerapp.xyz/#/members/151)"
    );
  });
});
