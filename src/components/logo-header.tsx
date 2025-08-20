import { Link } from '@tanstack/react-router'
import logo from '@/assets/logo-white.png'
import logoHover from '@/assets/logo-red.png'
import { useEffect, useState } from 'react'

export default function LogoHeader() {
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-10 left-0 right-0 p-2 flex gap-2 bg-transparent justify-center z-[100] ${isScrolled ? 'hidden' : ''}`}>
      <nav className="flex flex-row items-center">
        <div className="px-2 font-bold">
          <Link 
            to="/" 
            className="block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img 
              src={isHovered ? logoHover : logo} 
              alt="PiggyBanx Logo" 
              className="h-20 w-20 object-contain transition-opacity duration-200 backdrop-blur-sm rounded-full" 
            />
          </Link>
        </div>

        {/* <div className="px-2 font-bold hover:text-red-600 transition-all">
          <Link to="/collector/collector-form">Collector Form</Link>
        </div> */}

        {/* <div className="px-2 font-bold">
          <Link to="/demo/form/address">Address Form</Link>
        </div> */}
        {/* <div className="px-2 font-bold">
          <Link to="/demo/form/simple">Simple Form</Link>
        </div>



        <div className="px-2 font-bold">
          <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/api-request">Start - API Request</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query">TanStack Query</Link>
        </div> */}
      </nav>
    </header>
  )
}
