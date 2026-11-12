// The website's public pages live at the root - search engines index them, the
// build pre-renders them (seo/). The Mini App keeps /app/*; the code navigates
// to ROUTE_PATTERNS and useNavigateTo turns those into these on the website.
export const SITE_PATTERNS = {
  HOME: "/",
  VENUE: "/venues/:handle",
  ABOUT: "/about",
  OFFER: "/offer",
  PRIVACY: "/privacy",
  FAQ: "/faq"
} as const;

// ?lang=kg / ?lang=en; no parameter - Russian (the indexed default, x-default).
export const SITE_LANG_PARAM = "lang";
export const SITE_DEFAULT_LANGUAGE = "ru" as const;

const APP_TO_SITE: [RegExp, string][] = [
  [/^\/app\/?$/, SITE_PATTERNS.HOME],
  [/^\/app\/venues\/([^/]+)$/, "/venues/$1"],
  [/^\/app\/(about|offer|privacy|faq)$/, "/$1"]
];

// "/app/venues/sierra" → "/venues/sierra"; anything else (profile, orders,
// the cabinet) stays where it is.
export const toSitePath = (path: string) => {
  const rule = APP_TO_SITE.find(([pattern]) => pattern.test(path));

  return rule ? path.replace(rule[0], rule[1]) : path;
};

// Keeps the reader's language in a website address: sets ?lang, or drops it
// for Russian.
export const withSiteLanguage = (to: string, language: string) => {
  const [path = "", search = ""] = to.split("?");
  const query = new URLSearchParams(search);

  if (language === SITE_DEFAULT_LANGUAGE) query.delete(SITE_LANG_PARAM);
  else query.set(SITE_LANG_PARAM, language);

  const rest = query.toString();

  return rest ? `${path}?${rest}` : path;
};
