import React from "react";

export default function SpinnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
