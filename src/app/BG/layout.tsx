import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude",
  description: "Background loop.",
};

export default function BGLayout({ children }: { children: React.ReactNode }) {
  return children;
}
