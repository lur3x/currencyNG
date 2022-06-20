export interface Crypto {
  id: string;
  image: string;
  symbol: string;
  current_price: string;
  price_change_percentage_24h: string;
  market_cap: string;
}
export interface Coin {
  name: string;
  id: string;
  image: { large: string };
  market_cap_rank: string;
  market_data: {
    current_price: { uah: string; usd: string };
    market_cap: { uah: string; usd: string };
  };

  description: { en: string };
}
