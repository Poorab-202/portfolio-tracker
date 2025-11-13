export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        
        
        <h1 className="text-5xl font-extrabold mb-4 text-gray-50">
          Lotwise Portfolio Tracker
        </h1>

        <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
          Track your buy & sell trades, monitor open positions, 
          and calculate real-time realized profit & loss using FIFO lots.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   

          <a
              
            href="/trades"
            className="p-8 rounded-2xl bg-white backdrop-blur border border-gray-300 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Trades
            </h2>
            <p className="text-gray-600">
              Submit buy & sell trades into the system.
            </p>
          </a>

         



          <a
            href="/positions"
            className="p-8 rounded-2xl bg-white backdrop-blur border border-gray-300 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Positions
            </h2>
            <p className="text-gray-600">
              View open lots, remaining quantities, and average cost.
            </p>
          </a>

       



          <a
            href="/pnl"
            className="p-8 rounded-2xl bg-white backdrop-blur border border-gray-300 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Realized P&L
            </h2>
            <p className="text-gray-600">
              Analyze profit & loss from closed lots.
            </p>
          </a>

        </div>

      </div>
    </div>
  );
}
