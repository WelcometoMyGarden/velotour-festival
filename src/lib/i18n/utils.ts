// based on https://docs.astro.build/en/recipes/i18n/
import type { AstroGlobal } from "astro";
import { ui, defaultLang, languages } from "./ui";

export function getLangFromUrl(urlStr: string) {
  const url = new URL(urlStr);
  // Extracts nl.html & such
  const [, path] = url.pathname.split("/");
  // Get the 2-char lang code
  const lang = path.substring(0, 2);
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function langPath(lang: string) {
  return lang === "en" ? "" : lang;
}

export function urlLangPath(urlStr: string) {
  return langPath(getLangFromUrl(urlStr))
}

export function langLocale(lang: string) {
  return lang === "en" ? "en-GB" : lang;
}

export const getNavigatorLangCode = () =>
  navigator.language.split(/[-_]/)[0].toLowerCase();

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(url: string) {
  const lang = getLangFromUrl(url);

  return function t(key: UIKey) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export const otherLanguages = (Astro: AstroGlobal) =>
  Object.entries(languages).filter(
    ([lang]) => lang !== getLangFromUrl(Astro.url.toString()),
  );

export const supportedLangKeys = Object.keys(languages);

export const allLangPaths = supportedLangKeys.map(langPath);

export const isHomePath = (langPath: string) =>
  allLangPaths.find((lP) => langPath.toLowerCase() === lP) != null;

// Trailing slash escaping shouldn't be neccesary due to config, here for safety.
export const isHomePage = (url: URL) => isHomePath(url.pathname.substring(1).replace(/\/$/g, ''));

export const toSupportedLang = (lang: string) =>
  supportedLangKeys.includes(lang) ? lang : "en";

// TODO: when precompiling without SSR, we can't get the language from cookies or the Accept-Language
// must choose approach:
// - frontend SPA language
// - multilingual url paths
export const langPathAstro = (Astro: AstroGlobal) => langPath("en");
