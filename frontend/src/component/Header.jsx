"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/progress", label: "Progress" },
    // { href: "/certificate", label: "Certificate" },
    { href: "/delete", label: "Delete Account" },
    { href: "/logout", label: "Logout Account" }
  ]

  return (
    <nav className="flex flex-col sm:space-y-3 md:flex-row bg-gray-50 w-full py-[5vh] px-[5vw] items-center justify-between sticky top-0 backdrop-blur-md">
      <span className="text-2xl font-bold">Learning App</span>
      <ul className="flex flex-col sm:flex-row sm:space-x-[5vw] items-center">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`font-semibold transition-colors duration-300 ${
                pathname === link.href ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
