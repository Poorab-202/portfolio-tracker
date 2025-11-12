create extension if not  exists "pgcrypto";

CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price NUMERIC(18,6) NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,           
  original_qty INTEGER NOT NULL,
  cost NUMERIC(18,6) NOT NULL,    
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  trade_id uuid REFERENCES trades(id)
);

CREATE TABLE IF NOT EXISTS realized_pnl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,          
  buy_lot_id uuid REFERENCES lots(id),
  sell_trade_id uuid REFERENCES trades(id),
  buy_cost NUMERIC(18,6) NOT NULL,
  sell_price NUMERIC(18,6) NOT NULL,
  pnl NUMERIC(18,6) NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE OR REPLACE VIEW positions AS
SELECT
  symbol,
  SUM(qty) AS open_qty,
  CASE WHEN SUM(qty) = 0 THEN NULL ELSE (SUM(qty * cost) / SUM(qty)) END AS avg_cost
FROM lots
WHERE qty > 0
GROUP BY symbol;