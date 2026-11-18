import { wingsDocsUrl } from "./site";

export const wingsSectionUrl = "https://featherpanel.com/docs/wings/";

export const wingsNav = [
  {
    title: "Installation",
    href: wingsDocsUrl,
    description: "Install FeatherWings on the machines that host games.",
  },
  {
    title: "config.yml",
    href: "https://featherpanel.com/docs/wings/configuration/",
    description: "Daemon configuration on the node.",
  },
  {
    title: "Troubleshooting",
    href: "https://featherpanel.com/docs/wings/troubleshooting/",
    description: "Fixes for common FeatherWings problems.",
  },
] as const;

export const docTabs = [
  { id: "start", label: "Start", href: "/docs/start/introduction" },
  { id: "panel", label: "Panel", href: "/docs/panel/install" },
  { id: "wings", label: "Wings", href: wingsSectionUrl, external: true },
  { id: "help", label: "Help", href: "/docs/help/troubleshooting" },
] as const;

export const sectionLabels = {
  start: "Start",
  panel: "Panel",
  help: "Help",
  wings: "Wings",
} as const;
