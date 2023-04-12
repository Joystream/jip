const COLORS = {
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

export const colorString = (color: keyof typeof COLORS, message: string) =>
  `${COLORS[color]}${message}${COLORS.reset}`;

export const warning = (message: string) => `[${colorString("yellow", "WARNING")}] ${message}`;

export const success = (message: string) => `[${colorString("green", "SUCCESS")}] ${message}`;
