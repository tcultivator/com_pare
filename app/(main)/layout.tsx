
import Providers from "./providers";
import Navbar from "../components/navbar/NavBar"
import { EdgeStoreProvider } from '@/lib/edgestore'
import { Toaster } from "@/app/components/ui/sonner";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <Navbar />
        <EdgeStoreProvider>
          {children}
          <Toaster richColors position="top-right" />
        </EdgeStoreProvider>
      </Providers>
    </>

  );
}
