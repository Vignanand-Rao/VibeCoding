"""
End-to-end Integration and Verification Script for Multi-Filter Catalog
Tests the live FastAPI server with INR currency, 150+ products, and color filters.
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
    
    req = urllib.request.Request(url, headers={"User-Agent": "E2ETester/2.0"})
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

    print("\n--- 1. Health & Catalog Metadata Verification (INR Currency) ---")
    status, health = get("health")
    assert_test(status == 200 and health.get("status") == "ok", "API Health check returns OK")
    assert_test(health.get("currency") == "INR", "API reports currency as INR")

    status, meta = get("meta")
    assert_test(status == 200, "Catalog metadata endpoint returns 200")
    assert_test(meta["total_products"] >= 150, f"Dataset has 150+ products (found {meta.get('total_products')})")
    assert_test(set(meta["categories"]) == {"Apparel", "Electronics", "Footwear"}, "All 3 categories present in metadata")
    assert_test(len(meta["colors"]) >= 5, f"At least 5 colors in metadata (found {len(meta.get('colors', []))})")
    assert_test(meta["min_price"] < 500, f"Catalog min price is in INR below 500 (found {meta.get('min_price')})")
    assert_test(meta["max_price"] > 50000, f"Catalog max price is in INR above 50,000 (found {meta.get('max_price')})")

    print("\n--- 2. Default State (No Filters) ---")
    status, data = get("products")
    assert_test(status == 200, "GET /api/products returns 200")
    total_count = data["total"]
    assert_test(total_count >= 150, f"Total count >= 150 without filters (found {total_count})")
    assert_test(len(data["products"]) == total_count, "All products returned without filters")

    print("\n--- 3. Category Multi-Filter (50+ Per Category & OR Logic) ---")
    for cat in ["Electronics", "Apparel", "Footwear"]:
        status, data = get("products", {"category": [cat]})
        assert_test(status == 200, f"Single category query for {cat} succeeds")
        assert_test(data["total"] >= 50, f"{cat} category has 50+ products (found {data['total']})")
        assert_test(all(p["category"] == cat for p in data["products"]), f"All returned items are {cat}")

    # Multi-Category (Electronics + Footwear) -> OR logic
    status, data = get("products", {"category": ["Electronics", "Footwear"]})
    assert_test(data["total"] >= 100, f"Electronics OR Footwear has 100+ products (found {data['total']})")
    assert_test(all(p["category"] in ["Electronics", "Footwear"] for p in data["products"]), "All items in selected categories")
    cats_found = {p["category"] for p in data["products"]}
    assert_test(cats_found == {"Electronics", "Footwear"}, "Both categories represented (OR logic)")

    print("\n--- 4. Color Filter (OR Logic across colors) ---")
    # Single Color: Black
    status, data_black = get("products", {"color": ["Black"]})
    assert_test(status == 200, "Single color query for Black succeeds")
    assert_test(data_black["total"] > 0, f"Black products found ({data_black['total']})")
    assert_test(all(p["color"].lower() == "black" for p in data_black["products"]), "All returned items are Black")

    # Multi-Color: Black + Blue (OR logic)
    status, data_bb = get("products", {"color": ["Black", "Blue"]})
    assert_test(data_bb["total"] > data_black["total"], "Black + Blue returns more items than Black alone (OR logic)")
    assert_test(all(p["color"] in ["Black", "Blue"] for p in data_bb["products"]), "All items are either Black or Blue")
    colors_found = {p["color"] for p in data_bb["products"]}
    assert_test(colors_found == {"Black", "Blue"}, "Both Black and Blue represented")

    print("\n--- 5. Price Filter in INR (Presets & Inclusive Boundaries) ---")
    # Below ₹500
    status, data = get("products", {"max_price": 500.0})
    assert_test(status == 200, "Below 500 query succeeds")
    assert_test(data["total"] > 0, f"Items found below 500 INR ({data['total']})")
    assert_test(all(p["price"] <= 500.0 for p in data["products"]), "All items price <= 500.0")

    # ₹500 <= price <= ₹1000
    status, data = get("products", {"min_price": 500.0, "max_price": 1000.0})
    assert_test(status == 200, "500-1000 INR query succeeds")
    assert_test(data["total"] > 0, f"Items found between 500 and 1000 INR ({data['total']})")
    assert_test(all(500.0 <= p["price"] <= 1000.0 for p in data["products"]), "All items in 500-1000 INR range")

    # Above ₹10,000
    status, data = get("products", {"min_price": 10000.0})
    assert_test(status == 200, "Above 10,000 INR query succeeds")
    assert_test(data["total"] > 0, f"Items found above 10,000 INR ({data['total']})")
    assert_test(all(p["price"] >= 10000.0 for p in data["products"]), "All items price >= 10000.0")

    print("\n--- 6. Minimum Star Rating Filtering ---")
    for min_r in [1, 2, 3, 4, 5]:
        status, data = get("products", {"min_rating": min_r})
        assert_test(status == 200, f"Min rating {min_r} query succeeds")
        assert_test(all(p["rating"] >= min_r for p in data["products"]), f"All items have rating >= {min_r}")

    print("\n--- 7. Simultaneous Multi-Criteria Filtering (AND Logic) ---")
    # Category = Footwear AND Color = Red AND Price in [1000, 20000] AND Rating >= 4.0
    status, data = get("products", {
        "category": ["Footwear"],
        "color": ["Red"],
        "min_price": 1000.0,
        "max_price": 20000.0,
        "min_rating": 4.0
    })
    assert_test(data["total"] > 0, "Combined filter yields matching items")
    for p in data["products"]:
        assert_test(p["category"] == "Footwear", "Item belongs to Footwear")
        assert_test(p["color"] == "Red", "Item color is Red")
        assert_test(1000.0 <= p["price"] <= 20000.0, f"Item price {p['price']} is in [1000.0, 20000.0]")
        assert_test(p["rating"] >= 4.0, f"Item rating {p['rating']} is >= 4.0")

    print("\n--- 8. Sorting Logic (Price Low to High & Top Rated First in INR) ---")
    # Price: Low to High
    status, data = get("products", {"sort_by": "price_asc"})
    prices = [p["price"] for p in data["products"]]
    assert_test(prices == sorted(prices), "Products sorted ascending by price in INR")

    # Top Rated First
    status, data = get("products", {"sort_by": "rating_desc"})
    ratings = [p["rating"] for p in data["products"]]
    assert_test(ratings == sorted(ratings, reverse=True), "Products sorted descending by rating")

    # Default Order
    status_def, data_def = get("products", {"sort_by": "default"})
    status_raw, data_raw = get("products")
    assert_test([p["id"] for p in data_def["products"]] == [p["id"] for p in data_raw["products"]], "Default order preserves relative catalog order")

    # Filtering + Sorting combination
    status, data = get("products", {"category": ["Electronics"], "sort_by": "price_asc"})
    assert_test(all(p["category"] == "Electronics" for p in data["products"]), "Filtered to Electronics first")
    prices_elec = [p["price"] for p in data["products"]]
    assert_test(prices_elec == sorted(prices_elec), "Electronics items sorted ascending by price")

    print("\n--- 9. Empty Results Handling ---")
    status, data = get("products", {
        "category": ["Apparel"],
        "min_price": 10.0,
        "max_price": 50.0
    })
    assert_test(status == 200, "Empty criteria returns status 200")
    assert_test(data["total"] == 0, "Total is 0 for non-matching criteria")
    assert_test(len(data["products"]) == 0, "Products array is empty []")

    print("\n--- 10. Error Validation (min_price > max_price) ---")
    status, err_data = get("products", {"min_price": 5000.0, "max_price": 1000.0})
    assert_test(status == 400, "Invalid price bounds returns HTTP 400 Bad Request")

    print("\n" + "="*50)
    print(f"ALL TESTS COMPLETED: {passed}/{total} PASSED (100% SUCCESS)")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_tests()
