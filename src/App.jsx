import React, { useState, useEffect, useCallback } from "react";

// 1. Custom Hook: Fetch Stock Data
function useStockData(symbol) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockPrices = { AAPL: 180, GOOG: 140 };
      setData({ symbol, price: mockPrices[symbol] || 100 });
    }, 100);

    return () => clearTimeout(timer);
  }, [symbol]);

  return data;
}

// 2. Child Component: Individual Stock Card
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

// 3. Main Dashboard Component
export function StockDashboard() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  const aapl = useStockData("AAPL");
  const goog = useStockData("GOOG");

  const stocks = [aapl, goog].filter(Boolean);

  const filteredStocks = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(query.toLowerCase()),
  );

  const handleFavorite = (symbol) => {
    setFavorites([...favorites, symbol]);
  };

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
