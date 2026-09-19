import { useEffect } from "react";
import type { WeddingTheme } from "../types";

export function useApplyTheme(theme?: WeddingTheme) {
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-secondary", theme.secondaryColor);
    root.style.setProperty("--color-bg", theme.backgroundColor);
    root.style.setProperty("--color-text", theme.textColor);
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--font-heading", `'${theme.headingFont}', serif`);
    root.style.setProperty("--font-body", `'${theme.bodyFont}', sans-serif`);
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;

    return () => {
      // reset to defaults when unmounting the themed page
      root.style.removeProperty("--color-primary");
      root.style.removeProperty("--color-secondary");
      root.style.removeProperty("--color-bg");
      root.style.removeProperty("--color-text");
      root.style.removeProperty("--color-accent");
      root.style.removeProperty("--font-heading");
      root.style.removeProperty("--font-body");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);
}
