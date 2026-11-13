import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services import filter_and_sort_products, load_products, get_catalog_metadata
from app.models import Product

class TestBackendFilteringAndSorting(unittest.TestCase):

    def test_01_load_products(self):
        """Test dataset loading and category representation."""
        products = load_products()
        self.assertEqual(len(products), 24, "Should load all 24 products")
        categories = {p.category for p in products}
        self.assertEqual(categories, {"Electronics", "Apparel", "Footwear"})
        for p in products:
            self.assertIsInstance(p, Product)
            self.assertGreater(p.price, 0)
            self.assertGreaterEqual(p.rating, 1.0)
            self.assertLessEqual(p.rating, 5.0)

    def test_02_catalog_metadata(self):
        """Test metadata extraction for categories and price ranges."""
        meta = get_catalog_metadata()
        self.assertEqual(meta["total_products"], 24)
        self.assertEqual(sorted(meta["categories"]), ["Apparel", "Electronics", "Footwear"])
        self.assertLessEqual(meta["min_price"], 15.0)
        self.assertGreaterEqual(meta["max_price"], 799.0)

    def test_03_no_filters_returns_all(self):
        """Test that without filters, the full inventory is returned intact."""
        items, total, all_total = filter_and_sort_products()
        self.assertEqual(total, 24)
        self.assertEqual(all_total, 24)
        self.assertEqual(len(items), 24)

    def test_04_single_category_filter(self):
        """Test filtering by single category."""
        items, total, _ = filter_and_sort_products(categories=["Electronics"])
        self.assertGreater(total, 0)
        self.assertTrue(all(p.category == "Electronics" for p in items))

    def test_05_multi_category_filter_or_logic(self):
        """Test OR logic when multiple categories are selected."""
        items, total, _ = filter_and_sort_products(categories=["Electronics", "Apparel"])
        self.assertGreater(total, 0)
        for p in items:
            self.assertIn(p.category, ["Electronics", "Apparel"])
        categories_found = {p.category for p in items}
        self.assertEqual(categories_found, {"Electronics", "Apparel"})

    def test_06_price_filter_inclusive_boundaries(self):
        """Test price range with inclusive boundaries."""
        # Range 50.0 to 150.0
        items, total, _ = filter_and_sort_products(min_price=50.0, max_price=150.0)
        self.assertGreater(total, 0)
        for p in items:
            self.assertTrue(50.0 <= p.price <= 150.0, f"Product price {p.price} out of bounds")

        # Test exact boundary match for a product priced at 180.0
        items_exact, total_exact, _ = filter_and_sort_products(min_price=180.0, max_price=180.0)
        self.assertGreater(total_exact, 0)
        self.assertTrue(all(p.price == 180.0 for p in items_exact))

    def test_07_min_rating_filter(self):
        """Test minimum star rating filter (>= min_rating)."""
        items, total, _ = filter_and_sort_products(min_rating=4.5)
        self.assertGreater(total, 0)
        for p in items:
            self.assertGreaterEqual(p.rating, 4.5)

    def test_08_simultaneous_multi_criteria_and_logic(self):
        """Test AND logic between Category, Price, and Rating."""
        items, total, _ = filter_and_sort_products(
            categories=["Electronics"],
            min_price=50.0,
            max_price=200.0,
            min_rating=4.5
        )
        self.assertGreater(total, 0)
        for p in items:
            self.assertEqual(p.category, "Electronics")
            self.assertTrue(50.0 <= p.price <= 200.0)
            self.assertGreaterEqual(p.rating, 4.5)

    def test_09_sorting_price_low_to_high(self):
        """Test sorting by Price: Low to High."""
        items, total, _ = filter_and_sort_products(sort_by="price_asc")
        prices = [p.price for p in items]
        self.assertEqual(prices, sorted(prices), "Prices should be in ascending order")

    def test_10_sorting_top_rated_first(self):
        """Test sorting by Top Rated First."""
        items, total, _ = filter_and_sort_products(sort_by="rating_desc")
        ratings = [p.rating for p in items]
        self.assertEqual(ratings, sorted(ratings, reverse=True), "Ratings should be descending")

    def test_11_default_sorting_preserves_order(self):
        """Test default sorting preserves original relative order."""
        original = load_products()
        items, _, _ = filter_and_sort_products(sort_by="default")
        self.assertEqual([p.id for p in items], [p.id for p in original])

    def test_12_filtering_before_sorting(self):
        """Verify that filtering executes before sorting."""
        items, _, _ = filter_and_sort_products(categories=["Footwear"], sort_by="price_asc")
        self.assertTrue(all(p.category == "Footwear" for p in items))
        prices = [p.price for p in items]
        self.assertEqual(prices, sorted(prices))

    def test_13_empty_results(self):
        """Verify handling when no products match criteria."""
        items, total, _ = filter_and_sort_products(min_price=1.0, max_price=2.0)
        self.assertEqual(total, 0)
        self.assertEqual(len(items), 0)

    def test_14_dataset_immutability(self):
        """Verify that repeated operations never mutate the underlying product dataset."""
        original = load_products()
        original_ids = [p.id for p in original]

        # Trigger several mutations on copies
        filter_and_sort_products(sort_by="price_asc")
        filter_and_sort_products(categories=["Footwear"])
        filter_and_sort_products(sort_by="rating_desc", min_rating=4.8)

        after = load_products()
        self.assertEqual([p.id for p in after], original_ids)

if __name__ == "__main__":
    unittest.main()
