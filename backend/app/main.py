from typing import List, Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ProductsResponse, CatalogMetaResponse
from .services import filter_and_sort_products, get_catalog_metadata

app = FastAPI(
    title="CareerFit E-Commerce Catalog API",
    description="Multi-Filter and Sorting Backend for E-Commerce Product Browsing",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173, 3000, and general development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ecommerce-catalog-api"}

@app.get("/api/meta", response_model=CatalogMetaResponse)
def get_metadata():
    """Returns catalog metadata: category list, global min and max prices, and product count."""
    return get_catalog_metadata()

@app.get("/api/products", response_model=ProductsResponse)
def get_products(
    category: Optional[List[str]] = Query(None, description="One or more categories (multi-select)"),
    categories: Optional[str] = Query(None, description="Comma-separated categories fallback"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price boundary (inclusive)"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price boundary (inclusive)"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating (1-5)"),
    sort_by: Optional[str] = Query("default", description="Sort option: default, price_asc, rating_desc")
):
    """
    Retrieves filtered and sorted products.
    Filter criteria:
      - Categories (OR logic across selected categories)
      - Price (inclusive range)
      - Star Rating (minimum rating)
      - AND logic between category, price, and rating
    Sorting criteria:
      - Applied strictly after filtering
      - Options: Default Order, Price: Low to High, Top Rated First
    """
    try:
        # Validate price boundaries if both are passed
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=400,
                detail=f"min_price ({min_price}) cannot be greater than max_price ({max_price})"
            )
            
        # Consolidate category inputs from both query styles
        cat_list: List[str] = []
        if category:
            for c in category:
                if "," in c:
                    cat_list.extend([part.strip() for part in c.split(",") if part.strip()])
                elif c.strip():
                    cat_list.append(c.strip())
        if categories:
            cat_list.extend([part.strip() for part in categories.split(",") if part.strip()])

        # Remove duplicates while preserving order
        seen = set()
        cleaned_categories = [c for c in cat_list if not (c.lower() in seen or seen.add(c.lower()))]

        products, total, all_total = filter_and_sort_products(
            categories=cleaned_categories if cleaned_categories else None,
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
