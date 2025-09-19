import Navbar from './component/page/navbar'
import Footer from './component/page/footer'
import type { Viewport } from 'next';
import { CartProvider } from '@/app/component/cartitem/CartContext'
import {ToastProvider} from '@/app/component/page/ToastContext';
import { AuthProvider } from '@/app/component/page/AuthContext';
import '@/app/styles/components/toast.css';
import '@/app/styles/globle.css'
// import './styles/pages/categories.css';
// import { Metadata } from 'next'
export const metadata = {
  
  title: { default: 'Indian Bazaar Guy - Your One-Stop Shop for All Your Needs',
    template: '%s - Indian Bazaar Guy' },
  keywords: 'e-commerce, online shopping, Indian Bazaar Guy, buy online, shop online, products, shopping',
  authors: [{ name: 'Indian Bazaar Guy', url: 'https://ibg.infinityfreeapp.com/' }],
  creator: 'Indian Bazaar Guy',
  openGraph: {
    title: 'Indian Bazaar Guy',
    description: 'Welcome to Indian Bazaar Guy - Your one-stop shop for all your needs!. Explore our wide range of products and enjoy a seamless shopping experience.',
    url: 'http://192.168.31.249;3000',
    siteName: 'Indian Bazaar Guy',
    images: [
      {
        url: 'http://localhost:3000//images/logo.png',
        width: 800,
        height: 500,
        alt: 'Indian Bazaar Guy Logo',
      },  ]},
  description: 'Welcome to Indian Bazaar Guy - Your one-stop shop for all your needs!. Explore our wide range of products and enjoy a seamless shopping experience.',
  // icons: {icon:"/image/logo.png"},
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider> 
        <CartProvider>
       <AuthProvider>
        <header>         
          <Navbar/>
        </header>
        <main>
            {children}
          </main>
        <footer>
          <Footer />
        </footer>
        </AuthProvider>
        </CartProvider>
        </ToastProvider> 
        </body>
    </html>
  )
}
