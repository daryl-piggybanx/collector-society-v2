import { useNavigate } from "@tanstack/react-router"

export default function BrutalistHeader() {
  const navigate = useNavigate()
  
  return (
    <header className="relative p-8 border-b border-border">
      {/* <div className="absolute top-4 left-4 text-xs font-mono">Extra pieces in print run will be allocated by a vote of the Knights of the Round Table</div> */}

      <div className="absolute top-4 right-4 text-xs font-mono">TANGIBLE EXPRESSION</div>

      <div className="text-center">
        <h1 className="text-8xl font-mono font-black tracking-tighter mb-2">KNIGHTS OF THE</h1>
        <h1 className="text-8xl font-mono font-black tracking-tighter">ROUND TABLE</h1>
      </div>

      <div className="absolute bottom-4 left-4 text-sm font-mono">EXCLUSIVE.UNFILTERED.EXPRESSION</div>

      <div className="z-50 absolute bottom-4 right-[12%]">
        <button 
          onClick={() => window.open('https://www.banxcalibur.com/user-account', '_blank', 'noopener,noreferrer')}
          className="cursor-pointer font-mono font-bold bg-black text-white px-8 py-1 tracking-wide"
        >
          LOGIN
        </button>
      </div>

      <nav className="absolute top-1/2 left-8 -translate-y-1/2">
        <div className="space-y-4 text-sm font-mono">

        </div>
      </nav>

      <nav className="absolute top-1/2 right-8 -translate-y-1/2">
        <div className="space-y-4 text-sm font-mono text-right">
          <div>THE TABLE</div>
          <div>THE SWORDS</div>
          <div>THE KNIGHTS</div>
        </div>
      </nav>
    </header>
  )
}
