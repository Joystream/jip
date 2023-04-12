import fs from "fs";
import path from "path";

export const JIP_FOLDER_IDENTIFIER = "jip-";
export type JipId = `${typeof JIP_FOLDER_IDENTIFIER}${number}`;

export const getJIPDirectory = (jipId: JipId) => path.join(process.cwd(), `../${jipId}/jip.md`);

export const isStringJipId = (string: string) => /jip-[0-9]/g.test(string);

export const getAllJipIDs = () => {
  const rootFolder = path.join(process.cwd(), "..");
  const rootFolderJIPs = fs
    .readdirSync(rootFolder)
    .filter((itemName) => itemName.includes(JIP_FOLDER_IDENTIFIER)) as Array<JipId>;

  return rootFolderJIPs;
};
