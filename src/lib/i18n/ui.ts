// import en from "../../locales/en.json";
// import fr from "../../locales/fr.json";
// import nl from "../../locales/nl.json";
const en = {
  "ratings": "experiences shared"
}
const fr = {
  "ratings": "expériences partagées"
}
const nl = {
  "ratings": "ervaringen gedeeld"
}

export const languages = {
  en: "English",
  fr: "Français",
  nl: "Nederlands",
};

export type UILanguage = keyof typeof languages;

export const defaultLang = "en";

export const ui = {
  en,
  fr,
  nl,
} as const;
