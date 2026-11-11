// Copies of ../backend/docs/legal/* - the backend's are the source (Alisher
// sends a prompt when they change; `legal.test.ts` compares the copies with
// the backend's when it sits next to this repo). As is - never edited here.
import about from "./about.md?raw";
import offer from "./offer.ru.md?raw";
import privacy from "./privacy.ru.md?raw";

export const LEGAL_TEXTS = { about, offer, privacy } as const;

// about.md holds every language under «## ru» / «## kg» / «## en».
export const getAboutText = (language: string) => {
  const section = about.split(/^## /m).find((part) => part.startsWith(`${language}\n`));

  return section ? section.slice(section.indexOf("\n") + 1).trim() : "";
};
