import random

class MarketService:
    # High-quality realistic commodity price indexes mimicking Agmarknet feed datasets
    COMMODITY_DATABASE = [
        {"id": "c1", "commodity": "Rice (Basmati)", "market": "Karnal", "state": "Haryana", "min_price": 6200, "max_price": 7500, "modal_price": 6800, "unit": "Quintal"},
        {"id": "c2", "commodity": "Rice (Coarse)", "market": "Nellore", "state": "Andhra Pradesh", "min_price": 2100, "max_price": 2600, "modal_price": 2400, "unit": "Quintal"},
        {"id": "c3", "commodity": "Wheat", "market": "Khanna", "state": "Punjab", "min_price": 2275, "max_price": 2450, "modal_price": 2350, "unit": "Quintal"},
        {"id": "c4", "commodity": "Cotton (Kapas)", "market": "Rajkot", "state": "Gujarat", "min_price": 6800, "max_price": 8200, "modal_price": 7500, "unit": "Quintal"},
        {"id": "c5", "commodity": "Sugarcane", "market": "Muzaffarnagar", "state": "Uttar Pradesh", "min_price": 315, "max_price": 340, "modal_price": 325, "unit": "Tonne"},
        {"id": "c6", "commodity": "Banana", "market": "Jalgaon", "state": "Maharashtra", "min_price": 1800, "max_price": 2500, "modal_price": 2200, "unit": "Quintal"},
        {"id": "c7", "commodity": "Tomato", "market": "Kolar", "state": "Karnataka", "min_price": 1200, "max_price": 2000, "modal_price": 1600, "unit": "Quintal"},
        {"id": "c8", "commodity": "Onion", "market": "Lasalgaon", "state": "Maharashtra", "min_price": 1500, "max_price": 2200, "modal_price": 1850, "unit": "Quintal"},
        {"id": "c9", "commodity": "Groundnut", "market": "Adoni", "state": "Andhra Pradesh", "min_price": 5800, "max_price": 6700, "modal_price": 6300, "unit": "Quintal"},
        {"id": "c10", "commodity": "Maize", "market": "Gulabbagh", "state": "Bihar", "min_price": 1950, "max_price": 2200, "modal_price": 2100, "unit": "Quintal"},
    ]

    @classmethod
    async def get_live_prices(cls, query: str = None, state: str = None) -> list:
        """
        Retrieves pricing arrays matching optional name and state filters.
        """
        prices = [item.copy() for item in cls.COMMODITY_DATABASE]
        
        # Add random minor market fluctuations to simulate live price updates
        for item in prices:
            variation = random.randint(-40, 40) if item["modal_price"] > 1000 else random.randint(-4, 4)
            item["modal_price"] += variation
            item["min_price"] += variation
            item["max_price"] += variation
            
        if query:
            prices = [p for p in prices if query.lower() in p["commodity"].lower()]
        if state:
            prices = [p for p in prices if state.lower() in p["state"].lower()]
            
        return prices
