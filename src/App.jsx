import React, { useState, useEffect, useCallback } from "react";

// ==========================================
// 1. CUSTOM HOOK: FETCH STOCK DATA
// ==========================================

/* --- OLD / UNOPTIMIZED VERSION ---
function useStockData(symbol) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ISSUE: No cancellation logic or stale response handling
    const timer = setTimeout(() => {
      const mockPrices = { AAPL: 180, GOOG: 140 };
      setData({ symbol, price: mockPrices[symbol] || 100 });
    }, 100);

    return () => clearTimeout(timer);
  }, [symbol]);

  return data;
}
---------------------------------- */

// REFACTORED / PRODUCTION VERSION
function useStockData(symbol) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCurrent = true; // Stale request flag

    const timer = setTimeout(() => {
      const mockPrices = { AAPL: 180, GOOG: 140 };
      if (isCurrent) {
        setData({ symbol, price: mockPrices[symbol] || 100 });
      }
    }, 100);

    return () => {
      isCurrent = false; // Prevents stale state updates on rapid unmounts/re-runs
      clearTimeout(timer);
    };
  }, [symbol]);

  return data;
}

// ==========================================
// 2. CHILD COMPONENT: STOCK CARD
// ==========================================

const StockCard = React.memo(function StockCard({ stock, onFavorite }) {
  console.log("StockCard Rendered:", stock.symbol);
  return (
    <div className="card">
      <h3>
        {stock.symbol}: ${stock.price}
      </h3>
      <button onClick={() => onFavorite(stock.symbol)}>Favorite</button>
    </div>
  );
});

// ==========================================
// 3. MAIN DASHBOARD COMPONENT
// ==========================================

export function StockDashboard() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  const aapl = useStockData("AAPL");
  const goog = useStockData("GOOG");

  const stocks = [aapl, goog].filter(Boolean);

  const filteredStocks = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(query.toLowerCase()),
  );

  /* --- OLD / UNOPTIMIZED VERSION ---
  // ISSUE: Re-created on every render, breaking React.memo inside StockCard
  const handleFavorite = (symbol) => {
    setFavorites([...favorites, symbol]);
  };
  ---------------------------------- */

  // REFACTORED / PRODUCTION VERSION
  const handleFavorite = useCallback((symbol) => {
    setFavorites((prev) => [...prev, symbol]);
  }, []); // Empty deps array prevents function reference re-creation

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter stocks..."
      />
      {filteredStocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          stock={stock}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
}

export default StockDashboard;
