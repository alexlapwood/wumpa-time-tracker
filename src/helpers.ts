import FontFaceObserver from "fontfaceobserver";

export type TWindow = Window &
  typeof globalThis & { visualViewport?: EventTarget };

const waitForFont = async (fontFamilyName: string) => {
  try {
    await new FontFaceObserver(fontFamilyName).load();
  } catch (error) {
    if (
      typeof error.message === "string" &&
      error.message.includes("timeout exceeded")
    ) {
      try {
        await waitForFont(fontFamilyName);
      } catch {}
    } else {
      throw error;
    }
  }
};

export const waitForFonts = async () => {
  const fonts = [];
  try {
    await waitForFont("Zoinks");
    fonts.push("Zoinks");
  } catch {
    try {
      await waitForFont("Bangers");
      fonts.push("Bangers");
      await waitForFont("Pacifico");
      fonts.push("Pacifico");
    } catch {}
  }
  try {
    await waitForFont("Roboto");
    fonts.push("Roboto");
  } catch {}
  return fonts;
};

export function isValidTimeString(timeString?: string) {
  if (timeString === undefined || /\D/g.test(timeString)) {
    return false;
  }

  const milliseconds = Number(timeString.padStart(2, "0").substr(-2)) * 10;
  const seconds = Number(timeString.padStart(4, "0").substr(-4, 2)) * 1000;
  const minutes = Number(timeString.slice(0, -4)) * 60 * 1000;

  const time = minutes + seconds + milliseconds;

  return time > 0 && seconds < 60000;
}

export function timeFromString(timeString: string) {
  const milliseconds = Number(timeString.padStart(2, "0").substr(-2)) * 10;
  const seconds = Number(timeString.padStart(4, "0").substr(-4, 2)) * 1000;
  const minutes = Number(timeString.slice(0, -4)) * 60 * 1000;

  return minutes + seconds + milliseconds;
}

export function timeToString(time: number) {
  let split = Math.floor(time / 10);
  let seconds = Math.floor(split / 100);
  const minutes = Math.floor(seconds / 60);
  split = split % 100;
  seconds = seconds % 60;
  return [
    String(minutes).padStart(1, "0"),
    String(seconds).padStart(2, "0"),
    String(split).padStart(2, "0")
  ].join("");
}
