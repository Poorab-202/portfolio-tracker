export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <a href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
          Lotwise
        </a>

        {/* NAV LINKS */}
        <div className="hidden md:flex space-x-8">
          <a href="/trades" className="text-gray-700 hover:text-gray-900  transition">
            Trades
          </a>
          <a href="/positions" className="text-gray-700 hover:text-gray-900  transition">
            Positions
          </a>
          <a href="/pnl" className="text-gray-700 hover:text-gray-900  transition">
            Realized P&L
          </a>
        </div>

      </div>
    </nav>
  );
}
