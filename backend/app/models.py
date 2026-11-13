from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Product(BaseModel):
    id: int
    name: str
    category: str
    price: float
    rating: float
    rating_count: int
    image: str
    description: str

class ProductsResponse(BaseModel):
    products: List[Product]
    total: int
    all_total: int
    applied_filters: Dict[str, Any]

class CatalogMetaResponse(BaseModel):
    categories: List[str]
    min_price: float
    max_price: float
    total_products: int
