'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation'

function LinkNavigation({ href, children }) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      prefetch={true}
      className={`${href === pathname ? 'bg-blue-700' : 'bg-transparent'} py-4 hover:bg-blue-700 duration-300 rounded-md font-medium w-full text-center text-white`}
    >
      {children}
    </Link>
  )
}

export function Navigation() {

  return (
    <nav className="py-4 px-5 flex flex-col items-center gap-4 bg-blue-500 sm:flex-row">
      <LinkNavigation href='/'>Script 100 transações</LinkNavigation>
      <LinkNavigation href='/transition'>Criar transação</LinkNavigation>
      <LinkNavigation href='/dynamodb'>Buscar dados</LinkNavigation>
    </nav>
  )
}