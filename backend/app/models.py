from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class Product(BaseModel):
    id: int
    name: str
    category: str
    price: float
    rating: float
    rating_count: int
    color: str
    image: str
    description: str

class ProductsResponse(BaseModel):
    products: List[Product]
    total: int
    all_total: int
    applied_filters: Dict[str, Any]

class CatalogMetaResponse(BaseModel):
    categories: List[str]
    colors: List[str]
    min_price: float
    max_price: float
    total_products: int

class UserSignupRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    email: str

class AuthResponse(BaseModel):
    status: str
    message: str
    token: str
    user: UserResponse

class CartItemPayload(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CartItemPayload]
    total_amount: float
    customer_name: Optional[str] = "Guest"
    customer_email: Optional[str] = "guest@example.com"

class CheckoutResponse(BaseModel):
    order_id: str
    status: str
    message: str
    items_count: int
    total_amount: float
