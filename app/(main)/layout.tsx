
import Providers from "./providers";
import Navbar from "../components/navbar/NavBar"
import { EdgeStoreProvider } from '@/lib/edgestore'

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
        </EdgeStoreProvider>
      </Providers>
    </>

  );
}
