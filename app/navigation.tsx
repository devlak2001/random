"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export function Navigation() {
  const pathname = usePathname();
  return (
    <div className="flex justify-center border-b-2 border-gray-200">
      <Link
        href="/"
        className={`py-3 px-6 transition-colors ${
          pathname === "/"
            ? "text-white bg-black"
            : "hover:text-black text-gray-700"
        } text-lg`}
      >
        Home
      </Link>
      <Link
        href="/spinner"
        className={`py-3 px-6 transition-colors ${
          pathname === "/spinner"
            ? "text-white bg-black"
            : "hover:text-black text-gray-700"
        } text-lg`}
      >
        Spinner
      </Link>
    </div>
  );
}
