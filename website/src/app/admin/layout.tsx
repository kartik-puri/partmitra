'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkLogin() {
      if (pathname === '/admin') {
        setChecking(false)
        return
      }

      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace('/admin')
        return
      }

      setChecking(false)
    }

    checkLogin()
  }, [pathname, router])

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Checking login...</p>
      </main>
    )
  }

  if (pathname === '/admin') {
    return <>{children}</>
  }

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' },
    { name: '+ Add Product', href: '/admin/products/new' },
    { name: 'History', href: '/admin/history' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex min-w-max items-center gap-2 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  pathname === link.href
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.replace('/admin')
              }}
              className="ml-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {children}
    </>
  )
}
