export const siteName = "Spirit Panel";

export const docsUrl = "/docs";

export const githubUrl = "https://github.com/SpiritFramework/SpiritPanel";

export const wingsDocsUrl =
  "https://featherpanel.com/docs/wings/installation/";

export const installCommand = `curl -fsSL https://raw.githubusercontent.com/SpiritFramework/SpiritPanel/main/scripts/spirit.sh -o /tmp/spirit.sh
sudo bash /tmp/spirit.sh`;

export const nav = [
  { href: "/features", label: "Features" },
  { href: "/get-started", label: "Get started" },
] as const;
