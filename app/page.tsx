
import Navbar from "./components/navbar/NavBar"
import Dashboard from "./components/dashboard/dashboard"
export default function Home() {


  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <Navbar />
      <Dashboard />
    </div>
  )
}