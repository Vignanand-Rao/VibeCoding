import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services import filter_and_sort_products, load_products, get_catalog_metadata
from app.models import Product

class TestBackendFilteringAndSorting(unittest.TestCase):

    def setUp(self):
        # Force reload to pick up fresh dataset
        load_products(force_reload=True)

    def test_01_load_products(self):
        """Test dataset loading and category representation (50+ per category)."""
        products = load_products()
        self.assertGreaterEqual(len(products), 150, "Should load at least 150 products")
        
        for cat in ["Electronics", "Apparel", "Footwear"]:
            cat_count = sum(1 for p in products if p.category == cat)
            self.assertGreaterEqual(cat_count, 50, f"{cat} must have at least 50 products (found {cat_count})")
            
        for p in products:
            self.assertIsInstance(p, Product)
            self.assertGreater(p.price, 0)
            self.assertGreaterEqual(p.rating, 1.0)
            self.assertLessEqual(p.rating, 5.0)
            self.assertTrue(bool(p.color), "Product must have a color attribute")

    def test_02_catalog_metadata(self):
        """Test metadata extraction for categories, colors, and price ranges in INR."""
        meta = get_catalog_metadata()
        self.assertGreaterEqual(meta["total_products"], 150)
        self.assertEqual(sorted(meta["categories"]), ["Apparel", "Electronics", "Footwear"])
        self.assertGreaterEqual(len(meta["colors"]), 5)
        self.assertLessEqual(meta["min_price"], 500.0)
        self.assertGreaterEqual(meta["max_price"], 50000.0)

    def test_03_no_filters_returns_all(self):
        """Test that without filters, the full inventory is returned intact."""
        items, total, all_total = filter_and_sort_products()
        self.assertGreaterEqual(total, 150)
        self.assertEqual(total, all_total)
        self.assertEqual(len(items), total)

    def test_04_single_category_filter(self):
        """Test filtering by single category."""
        items, total, _ = filter_and_sort_products(categories=["Electronics"])
        self.assertGreaterEqual(total, 50)
        self.assertTrue(all(p.category == "Electronics" for p in items))

    def test_05_multi_category_filter_or_logic(self):
        """Test OR logic when multiple categories are selected."""
        items, total, _ = filter_and_sort_products(categories=["Electronics", "Footwear"])
        self.assertGreaterEqual(total, 100)
        for p in items:
            self.assertIn(p.category, ["Electronics", "Footwear"])
        categories_found = {p.category for p in items}
        self.assertEqual(categories_found, {"Electronics", "Footwear"})

    def test_06_color_filter_single_and_multi_or_logic(self):
        """Test Color filter with OR logic."""
        # Single color
        items_black, total_black, _ = filter_and_sort_products(colors=["Black"])
        self.assertGreater(total_black, 0)
        self.assertTrue(all(p.color.lower() == "black" for p in items_black))

        # Multi-color (Black OR White)
        items_bw, total_bw, _ = filter_and_sort_products(colors=["Black", "White"])
        self.assertGreater(total_bw, total_black)
        for p in items_bw:
            self.assertIn(p.color.lower(), ["black", "white"])
        colors_found = {p.color for p in items_bw}
        self.assertEqual(colors_found, {"Black", "White"})

    def test_07_price_filter_inr_ranges(self):
        """Test price filters including Below 500, 500-1000, and above 10000."""
        # Below 500
        items_under_500, total_under_500, _ = filter_and_sort_products(max_price=500.0)
        self.assertGreater(total_under_500, 0)
        self.assertTrue(all(p.price <= 500.0 for p in items_under_500))

        # 500 <= price <= 1000
        items_500_1000, total_500_1000, _ = filter_and_sort_products(min_price=500.0, max_price=1000.0)
        self.assertGreater(total_500_1000, 0)
        self.assertTrue(all(500.0 <= p.price <= 1000.0 for p in items_500_1000))

        # Above 10000
        items_above_10k, total_above_10k, _ = filter_and_sort_products(min_price=10000.0)
        self.assertGreater(total_above_10k, 0)
        self.assertTrue(all(p.price >= 10000.0 for p in items_above_10k))

    def test_08_min_rating_filter(self):
        """Test minimum star rating filter (>= min_rating)."""
        items, total, _ = filter_and_sort_products(min_rating=4.5)
        self.assertGreater(total, 0)
        for p in items:
            self.assertGreaterEqual(p.rating, 4.5)

    def test_09_simultaneous_multi_criteria_and_logic(self):
        """Test AND logic between Category, Color, Price, and Rating."""
        items, total, _ = filter_and_sort_products(
            categories=["Footwear"],
            colors=["Red"],
            min_price=1000.0,
            max_price=20000.0,
            min_rating=4.0
        )
        self.assertGreater(total, 0)
        for p in items:
            self.assertEqual(p.category, "Footwear")
            self.assertEqual(p.color, "Red")
            self.assertTrue(1000.0 <= p.price <= 20000.0)
            self.assertGreaterEqual(p.rating, 4.0)

    def test_10_sorting_price_low_to_high(self):
        """Test sorting by Price: Low to High in INR."""
        items, _, _ = filter_and_sort_products(sort_by="price_asc")
        prices = [p.price for p in items]
        self.assertEqual(prices, sorted(prices))

    def test_11_sorting_top_rated_first(self):
        """Test sorting by Top Rated First."""
        items, _, _ = filter_and_sort_products(sort_by="rating_desc")
        ratings = [p.rating for p in items]
        self.assertEqual(ratings, sorted(ratings, reverse=True))

    def test_12_default_sorting_preserves_order(self):
        """Test default sorting preserves original relative order."""
        original = load_products()
        items, _, _ = filter_and_sort_products(sort_by="default")
        self.assertEqual([p.id for p in items], [p.id for p in original])

    def test_13_dataset_immutability(self):
        """Verify that repeated operations never mutate the underlying product dataset."""
        original = load_products()
        original_ids = [p.id for p in original]

        filter_and_sort_products(sort_by="price_asc")
        filter_and_sort_products(categories=["Footwear"], colors=["Black"])
        filter_and_sort_products(sort_by="rating_desc", min_rating=4.8)

        after = load_products()
        self.assertEqual([p.id for p in after], original_ids)

if __name__ == "__main__":
    unittest.main()
