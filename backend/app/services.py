import json
import os
from typing import List, Optional, Tuple
from .models import Product

_PRODUCTS_CACHE: List[Product] = []

def get_data_filepath() -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, "data", "products.json")

def load_products() -> List[Product]:
    global _PRODUCTS_CACHE
    if not _PRODUCTS_CACHE:
        filepath = get_data_filepath()
        with open(filepath, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            _PRODUCTS_CACHE = [Product(**item) for item in raw_data]
    # Return a new shallow copy of list to ensure callers never modify original cache
    return list(_PRODUCTS_CACHE)

def get_catalog_metadata():
    products = load_products()
    if not products:
        return {
            "categories": [],
            "min_price": 0.0,
            "max_price": 0.0,
            "total_products": 0
        }
    
    categories = sorted(list({p.category for p in products}))
    min_price = min(p.price for p in products)
    max_price = max(p.price for p in products)
    
    return {
        "categories": categories,
        "min_price": min_price,
        "max_price": max_price,
        "total_products": len(products)
    }

def filter_and_sort_products(
    categories: Optional[List[str]] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = "default"
) -> Tuple[List[Product], int, int]:
    """
    Filters and sorts the product catalog.
    Criteria:
      - Category: OR logic within multiple categories
      - Price: inclusive boundaries min_price <= price <= max_price
      - Rating: rating >= min_rating
      - AND logic between category, price, and rating
      - If no filters, returns complete original inventory.
      - Never modifies the original dataset.
      - Filtering happens first, followed by sorting.
    """
    raw_products = load_products()
    all_total = len(raw_products)
    
    # Work on a fresh copy
    filtered = list(raw_products)
    
    # 1. Category Filter (OR logic across selected categories)
    if categories:
        # Clean and lower-case for robust matching
        category_set = {c.strip().lower() for c in categories if c and c.strip()}
        if category_set:
            filtered = [p for p in filtered if p.category.lower() in category_set]
            
    # 2. Price Filter (inclusive min and max boundaries)
    if min_price is not None:
        filtered = [p for p in filtered if p.price >= float(min_price)]
    if max_price is not None:
        filtered = [p for p in filtered if p.price <= float(max_price)]
        
    # 3. Star Rating Filter (minimum rating boundary)
    if min_rating is not None and float(min_rating) > 0:
        filtered = [p for p in filtered if p.rating >= float(min_rating)]
        
    # 4. Sorting logic (happens strictly after filtering)
    sort_normalized = (sort_by or "default").strip().lower()
    
    if sort_normalized in ("price_asc", "price-low-to-high", "price: low to high", "price_low_to_high"):
        # Stable sort ascending by price
        filtered = sorted(filtered, key=lambda p: p.price)
    elif sort_normalized in ("rating_desc", "top-rated-first", "top rated first", "top_rated_first", "rating"):
        # Stable sort descending by rating
        filtered = sorted(filtered, key=lambda p: p.rating, reverse=True)
    elif sort_normalized in ("default", "default order", "default_order"):
        # Preserve original relative order
        pass
    else:
        # Default fallback
        pass
        
    return filtered, len(filtered), all_total
