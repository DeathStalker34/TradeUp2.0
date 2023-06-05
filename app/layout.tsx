import { Nunito } from "next/font/google"
import './globals.css'
import Navbar from './components/navbar/Navbar'
import ClientOnly from "./components/ClientOnly"
import RegisterModal from "./components/modals/RegisterModal"
import LoginModal from "./components/modals/LoginModal"
import RentModal from "./components/modals/RentModal"
import ToasterProvider from "./providers/ToasterProvider"
import getCurrentUser from "./actions/getCurrentUser"
import SearchModal from "./components/modals/SearchModal"
import Footer from "./components/footer/Footer"
import ActiveStatus from "./components/ActiveStatus"


export const metadata = {
  title: 'TradeUp',
  description: 'Intercambio de servicios',
}

const font = Nunito({
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="es">
      <body className={font.className}>
        <ClientOnly>
          <ActiveStatus />
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
          <Footer />
        </ClientOnly>

        <div className="">
          {children}
        </div>

      </body>
    </html>
  )
}