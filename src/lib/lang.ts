import { cookies } from "next/headers";
import { Lang, getDict } from "./i18n";

// Server-side: read the chosen language from the cookie.
export function getLang(): Lang {
  const c = cookies().get("lang")?.value;
  return c === "bn" ? "bn" : "en";
}

export function getServerDict() {
  return getDict(getLang());
}
