import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Zork I",
  description:
    "The Great Underground Empire, playable on your phone. The official open-source release of Zork I running in a JavaScript Z-machine.",
  icons: {
    icon: "/Zork/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Keep the command input visible above the on-screen keyboard on Android.
  interactiveWidget: "resizes-content",
};

export default function ZorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
