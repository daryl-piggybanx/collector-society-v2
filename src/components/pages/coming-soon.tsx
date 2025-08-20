import logo from '@/assets/logo-white.png'

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <img 
          src={logo} 
          alt="PiggyBanx Logo" 
          className="h-32 w-32 object-contain mx-auto mb-6"
        />
        <h1 className="text-white text-2xl font-bold">Coming Soon</h1>
      </div>
    </main>
  )
}