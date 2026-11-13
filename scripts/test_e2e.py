"""
End-to-end Integration and Verification Script
Tests the live FastAPI server and verifies all assessment requirements.
"""
import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def get(endpoint: str, params: dict = None):
    url = f"{BASE_URL}/{endpoint}"
    if params:
        query_parts = []
        for k, v in params.items():
            if isinstance(v, list):
                for item in v:
                    query_parts.append(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(item))}")
            elif v is not None:
                query_parts.append(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(v))}")
        if query_parts:
            url += "?" + "&".join(query_parts)
    
    req = urllib.request.Request(url, headers={"User-Agent": "E2ETester/1.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode("utf-8")
            return resp.status, json.loads(data)
    except urllib.error.HTTPError as e:
        data = e.read().decode("utf-8")
        try:
            return e.code, json.loads(data)
        except Exception:
            return e.code, {"detail": data}

def run_tests():
    passed = 0
    total = 0

    def assert_test(cond, msg):
        nonlocal passed, total
        total += 1
        if cond:
            passed += 1
            print(f"  [PASS] {msg}")
        else:
            print(f"  [FAIL] {msg}")
            sys.exit(1)

    print("\n--- 1. Health & Catalog Metadata Verification ---")
    status, health = get("health")
    assert_test(status == 200 and health.get("status") == "ok", "API Health check returns OK")

    status, meta = get("meta")
    assert_test(status == 200, "Catalog metadata endpoint returns 200")
    assert_test(meta["total_products"] == 24, f"Dataset has 24 products (found {meta.get('total_products')})")
    assert_test(set(meta["categories"]) == {"Apparel", "Electronics", "Footwear"}, "All 3 categories present in metadata")
    assert_test(meta["min_price"] == 14.99, "Catalog min price is 14.99")
    assert_test(meta["max_price"] == 799.00, "Catalog max price is 799.00")

    print("\n--- 2. Default State (No Filters) ---")
    status, data = get("products")
    assert_test(status == 200, "GET /api/products returns 200")
    assert_test(data["total"] == 24, "Total count is 24 without filters")
    assert_test(len(data["products"]) == 24, "All 24 products returned without filters")

    print("\n--- 3. Category Multi-Filter (OR Logic within Categories) ---")
    # Single Category
    status, data = get("products", {"category": ["Electronics"]})
    assert_test(status == 200, "Single category query succeeds")
    assert_test(data["total"] == 8, f"Electronics category has 8 products (found {data['total']})")
    assert_test(all(p["category"] == "Electronics" for p in data["products"]), "All returned items are Electronics")

    # Multi-Category (Electronics + Footwear) -> OR logic
    status, data = get("products", {"category": ["Electronics", "Footwear"]})
    assert_test(data["total"] == 16, f"Electronics OR Footwear has 16 products (found {data['total']})")
    assert_test(all(p["category"] in ["Electronics", "Footwear"] for p in data["products"]), "All items in selected categories")
    cats_found = {p["category"] for p in data["products"]}
    assert_test(cats_found == {"Electronics", "Footwear"}, "Both categories represented (OR logic)")

    # All Three Categories
    status, data = get("products", {"category": ["Electronics", "Apparel", "Footwear"]})
    assert_test(data["total"] == 24, "All three categories selected returns full inventory 24")

    print("\n--- 4. Dual-Handle Price Range Filtering (Inclusive Boundaries) ---")
    status, data = get("products", {"min_price": 50.0, "max_price": 150.0})
    assert_test(status == 200, "Price range query succeeds")
    assert_test(all(50.0 <= p["price"] <= 150.0 for p in data["products"]), "All items within [50.0, 150.0]")
    
    # Exact boundary check: 180.0 is Nike Air Jordan 1 Retro High OG
    status, data = get("products", {"min_price": 180.0, "max_price": 180.0})
    assert_test(data["total"] >= 1, "Inclusive boundary match for exactly 180.0")
    assert_test(any(p["price"] == 180.0 for p in data["products"]), "Product with exact boundary price included")

    # Lower boundary only
    status, data = get("products", {"min_price": 200.0})
    assert_test(all(p["price"] >= 200.0 for p in data["products"]), "All items price >= 200.0")

    # Upper boundary only
    status, data = get("products", {"max_price": 50.0})
    assert_test(all(p["price"] <= 50.0 for p in data["products"]), "All items price <= 50.0")

    print("\n--- 5. Minimum Star Rating Filtering ---")
    for min_r in [1, 2, 3, 4, 5]:
        status, data = get("products", {"min_rating": min_r})
        assert_test(status == 200, f"Min rating {min_r} query succeeds")
        assert_test(all(p["rating"] >= min_r for p in data["products"]), f"All items have rating >= {min_r}")

    print("\n--- 6. Simultaneous Multi-Criteria Filtering (AND Logic) ---")
    # Category = Footwear AND Price in [50, 200] AND Rating >= 4.5
    status, data = get("products", {
        "category": ["Footwear"],
        "min_price": 50.0,
        "max_price": 200.0,
        "min_rating": 4.5
    })
    assert_test(data["total"] > 0, "Combined filter yields matching items")
    for p in data["products"]:
        assert_test(p["category"] == "Footwear", "Item belongs to Footwear")
        assert_test(50.0 <= p["price"] <= 200.0, f"Item price {p['price']} is in [50.0, 200.0]")
        assert_test(p["rating"] >= 4.5, f"Item rating {p['rating']} is >= 4.5")

    print("\n--- 7. Sorting Logic (Filtering First, Then Sorting) ---")
    # Price: Low to High
    status, data = get("products", {"sort_by": "price_asc"})
    prices = [p["price"] for p in data["products"]]
    assert_test(prices == sorted(prices), "Products sorted ascending by price")

    # Top Rated First
    status, data = get("products", {"sort_by": "rating_desc"})
    ratings = [p["rating"] for p in data["products"]]
    assert_test(ratings == sorted(ratings, reverse=True), "Products sorted descending by rating")

    # Default Order
    status_def, data_def = get("products", {"sort_by": "default"})
    status_raw, data_raw = get("products")
    assert_test([p["id"] for p in data_def["products"]] == [p["id"] for p in data_raw["products"]], "Default order preserves relative catalog order")

    # Filtering + Sorting combination
    status, data = get("products", {"category": ["Apparel"], "sort_by": "price_asc"})
    assert_test(all(p["category"] == "Apparel" for p in data["products"]), "Filtered to Apparel first")
    prices_apparel = [p["price"] for p in data["products"]]
    assert_test(prices_apparel == sorted(prices_apparel), "Apparel items sorted ascending by price")

    print("\n--- 8. Empty Results Handling ---")
    # Criteria that matches nothing: rating 5.0 in Apparel between $10 and $20
    status, data = get("products", {
        "category": ["Apparel"],
        "min_price": 10.0,
        "max_price": 20.0,
        "min_rating": 5.0
    })
    assert_test(status == 200, "Empty criteria returns status 200")
    assert_test(data["total"] == 0, "Total is 0 for non-matching criteria")
    assert_test(len(data["products"]) == 0, "Products array is empty []")

    print("\n--- 9. Error Validation (min_price > max_price) ---")
    status, err_data = get("products", {"min_price": 500.0, "max_price": 100.0})
    assert_test(status == 400, "Invalid price bounds returns HTTP 400 Bad Request")

    print("\n" + "="*50)
    print(f"ALL TESTS COMPLETED: {passed}/{total} PASSED (100% SUCCESS)")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_tests()
