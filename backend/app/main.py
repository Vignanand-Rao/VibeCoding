import uuid
from typing import List, Optional, Dict
from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .models import (
    ProductsResponse,
    CatalogMetaResponse,
    Product,
    UserSignupRequest,
    UserLoginRequest,
    AuthResponse,
    UserResponse,
    CheckoutRequest,
    CheckoutResponse
)
from .services import filter_and_sort_products, get_catalog_metadata, load_products

app = FastAPI(
    title="CareerFit E-Commerce Catalog & Store API",
    description="Multi-Filter, Auth, Cart, and Product Browsing in INR (₹)",
    version="1.2.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory user store
_USERS_DB: Dict[str, dict] = {
    "demo@careerfit.com": {
        "name": "Demo User",
        "email": "demo@careerfit.com",
        "password": "password123"
    }
}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ecommerce-catalog-api", "currency": "INR"}

@app.get("/api/meta", response_model=CatalogMetaResponse)
def get_metadata():
    """Returns catalog metadata: category list, color list, min/max prices in INR, and product count."""
    return get_catalog_metadata()

@app.get("/api/products", response_model=ProductsResponse)
def get_products(
    category: Optional[List[str]] = Query(None, description="One or more categories (multi-select)"),
    categories: Optional[str] = Query(None, description="Comma-separated categories fallback"),
    color: Optional[List[str]] = Query(None, description="One or more colors (multi-select)"),
    colors: Optional[str] = Query(None, description="Comma-separated colors fallback"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price in INR (inclusive)"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price in INR (inclusive)"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating (1-5)"),
    sort_by: Optional[str] = Query("default", description="Sort option: default, price_asc, rating_desc")
):
    try:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=400,
                detail=f"min_price ({min_price}) cannot be greater than max_price ({max_price})"
            )
            
        cat_list: List[str] = []
        if category:
            for c in category:
                if "," in c:
                    cat_list.extend([part.strip() for part in c.split(",") if part.strip()])
                elif c.strip():
                    cat_list.append(c.strip())
        if categories:
            cat_list.extend([part.strip() for part in categories.split(",") if part.strip()])
        seen_cats = set()
        cleaned_categories = [c for c in cat_list if not (c.lower() in seen_cats or seen_cats.add(c.lower()))]

        color_list: List[str] = []
        if color:
            for col in color:
                if "," in col:
                    color_list.extend([part.strip() for part in col.split(",") if part.strip()])
                elif col.strip():
                    color_list.append(col.strip())
        if colors:
            color_list.extend([part.strip() for part in colors.split(",") if part.strip()])
        seen_colors = set()
        cleaned_colors = [c for c in color_list if not (c.lower() in seen_colors or seen_colors.add(c.lower()))]

        products, total, all_total = filter_and_sort_products(
            categories=cleaned_categories if cleaned_categories else None,
            colors=cleaned_colors if cleaned_colors else None,
            min_price=min_price,
            max_price=max_price,
            min_rating=min_rating,
            sort_by=sort_by
        )

        return ProductsResponse(
            products=products,
            total=total,
            all_total=all_total,
            applied_filters={
                "categories": cleaned_categories,
                "colors": cleaned_colors,
                "min_price": min_price,
                "max_price": max_price,
                "min_rating": min_rating,
                "sort_by": sort_by or "default"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/{product_id}", response_model=Product)
def get_product_detail(product_id: int):
    """Retrieve full details of a specific single product by ID."""
    all_products = load_products()
    matched = next((p for p in all_products if p.id == product_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")
    return matched

# --- Authentication Endpoints ---
@app.post("/api/auth/signup", response_model=AuthResponse)
def user_signup(payload: UserSignupRequest):
    email_clean = payload.email.strip().lower()
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    if not email_clean or "@" not in email_clean:
        raise HTTPException(status_code=400, detail="Valid email address is required")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    if email_clean in _USERS_DB:
        raise HTTPException(status_code=400, detail="Account with this email already exists")

    _USERS_DB[email_clean] = {
        "name": payload.name.strip(),
        "email": email_clean,
        "password": payload.password
    }

    token = f"jwt_{uuid.uuid4().hex[:16]}"
    return AuthResponse(
        status="success",
        message="Registration successful! Welcome to CareerFit Store.",
        token=token,
        user=UserResponse(name=payload.name.strip(), email=email_clean)
    )

@app.post("/api/auth/login", response_model=AuthResponse)
def user_login(payload: UserLoginRequest):
    email_clean = payload.email.strip().lower()
    user_record = _USERS_DB.get(email_clean)

    if not user_record or user_record["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = f"jwt_{uuid.uuid4().hex[:16]}"
    return AuthResponse(
        status="success",
        message="Welcome back!",
        token=token,
        user=UserResponse(name=user_record["name"], email=user_record["email"])
    )

# --- Cart Checkout Endpoint ---
@app.post("/api/cart/checkout", response_model=CheckoutResponse)
def process_checkout(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_id = f"CF-ORD-{uuid.uuid4().hex[:8].upper()}"
    return CheckoutResponse(
        order_id=order_id,
        status="confirmed",
        message="Your order has been placed successfully! Thank you for shopping with CareerFit.",
        items_count=sum(item.quantity for item in payload.items),
        total_amount=payload.total_amount
    )
