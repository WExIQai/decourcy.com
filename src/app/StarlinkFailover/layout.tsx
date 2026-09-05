import type { Metadata } from "next";
import "./starlink.css";

export const metadata: Metadata = {
  title: "Starlink Failover",
  description:
    "How a Starlink dish backs up a home Eero Pro 7 mesh: normal vs. backup operation, an outage minute by minute, and installer instructions.",
  icons: {
    icon: "/StarlinkFailover/icon.svg",
  },
};

export default function StarlinkFailoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
