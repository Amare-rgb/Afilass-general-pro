// src/components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import WebChat from "@/components/WebChat";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // ✅ Detect if we are on an admin page
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {/* ✅ Only show Header if NOT on an admin page */}
      {!isAdminPage && <Header />}

      {/* ✅ FIXED: Conditionally remove the top padding when on admin pages */}
      <main className={`min-h-screen ${isAdminPage ? '' : 'pt-[var(--header-offset,80px)]'}`}>
        {children}
      </main>

      {/* ✅ Only show Footer if NOT on an admin page */}
      {!isAdminPage && <Footer />}

      {/* ✅ Only show WebChat if NOT on an admin page */}
      {!isAdminPage && <WebChat />}
    </>
  );
}