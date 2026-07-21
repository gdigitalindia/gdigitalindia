"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { EnquiryProvider } from "./context/EnquiryContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingActions from "./components/FloatingActions/FloatingActions";

export default function ClientLayout({ 
  children, 
  menuData,
  packageData
}: { 
  children: React.ReactNode, 
  menuData: any[],
  packageData: any[]
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isAdmin]);

  return (
    <EnquiryProvider>
      {!isAdmin && <Navbar initialMenuData={menuData} packageData={packageData} />}
      {children}
      {!isAdmin && <FloatingActions />}
      {!isAdmin && <Footer />}
    </EnquiryProvider>
  );
}
