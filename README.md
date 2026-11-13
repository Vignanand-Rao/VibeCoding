# CareerFit E-Commerce Multi-Filter Sidebar Application

A high-performance, modern dark-themed e-commerce product browsing application featuring real-time multi-criteria filtering and server-side sorting. Built from scratch with a **Python FastAPI** backend and a **React 18 + Vite + TypeScript** frontend styled with **Tailwind CSS**.

---

## 🎨 Color Palette & Design Theme

The interface utilizes the signature **CareerFit** dark aesthetic:

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Jet Black** | `#0A0A0A` | Deep dark backgrounds, layout canvas, and high contrast surfaces |
| **Cerulean Blue** | `#007BA7` | Active filter pills, category checkboxes, slider tracks, brand badges |
| **Neon Rose** | `#FF2E63` | Star ratings, highlight badges, reset actions, subtle glow effects |

- **Dark surfaces**: `#121212` and `#181818` with subtle borders (`#222222`).
- **Typography**: Clean, crisp typography using the `Inter` font family.
- **Responsiveness**: Desktop sticky sidebar with mobile slide-out drawer panel.

---

## 🚀 Key Features

### 1. Left Sidebar – Multi-Criteria Filters
- **Category Checkboxes**: Multi-select support for `Electronics`, `Apparel`, and `Footwear` using **OR logic** within categories.
- **Dual-Handle Price Range Slider**: Independently adjustable minimum and maximum price handles with boundary enforcement, real-time numerical badges, and debounced server updates.
- **Minimum Star Rating Selection**: Interactive radio buttons (1 to 5 stars, plus "All Ratings") filtering products with rating $\ge$ chosen threshold.
- **Sticky Desktop & Collapsible Mobile Panel**: Stays pinned while scrolling on large screens and collapses into a slide-over drawer on mobile devices with an active filter badge.
- **Visible Reset Filters**: One-click restoration of all filter controls to their default state.

### 2. Right Section – Product Grid & Sort Controls
- **Product Cards**: High-definition imagery, category badge, product title, description snippet, prominent price, and star rating with review counts.
- **Result Counter**: Real-time count of matching products (e.g., *"Showing 16 of 24 items"*).
- **Active Filter Chips**: Interactive tags showing applied filters with quick-remove buttons.
- **Sort By Dropdown**:
  - `Default Order` (preserves catalog base order)
  - `Price: Low to High` (ascending price)
  - `Top Rated First` (descending rating)
- **Empty State**: Displays the exact message `"No items match your criteria."` alongside a visible **Reset Filters** button when no products meet the filter criteria.
- **Instant Updates**: Grid refreshes automatically on filter changes without needing an "Apply Filters" button.

---

## 🧠 Architecture & Filtering Rules

All filtering, validation, and sorting business logic executes **strictly on the backend**.

```
┌─────────────────────────────────┐           HTTP GET /api/products           ┌───────────────────────────────────┐
│     React + Vite Frontend       │ ─────────────────────────────────────────> │       Python FastAPI Backend      │
│  - Category checkboxes (state)  │ <───────────────────────────────────────── │  1. Load products (immutable)     │
│  - Dual range slider (debounced)│           JSON Response {products,         │  2. Category Filter (OR logic)    │
│  - Star rating radio buttons    │                          total, ...}       │  3. Price Range (inclusive min/max│
│  - Sort By dropdown             │                                            │  4. Star Rating (>= min_rating)   │
└─────────────────────────────────┘                                            │  5. Combine with AND logic        │
                                                                               │  6. Sort (Price asc / Rating desc)│
                                                                               └───────────────────────────────────┘
```

1. **Category Filtering**: Multiple selected categories use **OR** logic (product matches if its category is in the selected set).
2. **Price Range Filtering**: Products are included if `min_price <= product.price <= max_price` (inclusive boundaries).
3. **Rating Filtering**: Products are included if `product.rating >= min_rating`.
4. **Combined Logic**: Category, Price, and Rating criteria are combined using strict **AND** logic.
5. **Execution Order**: Filtering is executed **first**, followed immediately by sorting on the remaining matches.
6. **Dataset Immutability**: The original catalog dataset is never modified in memory.

---

## 📁 Project Structure

```
VibeCoding/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI endpoints, CORS, query validation
│   │   ├── models.py            # Pydantic data schemas
│   │   ├── services.py          # Filtering, sorting & catalog service
│   │   └── data/
│   │       └── products.json    # Realistic 24-product dataset
│   ├── requirements.txt         # Python dependencies
│   └── test_backend.py          # Unit test suite (14 test cases)
├── frontend/
│   ├── public/
│   │   └── favicon.svg          # CareerFit SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # Brand header with status indicator & mobile toggle
│   │   │   ├── FilterSidebar.tsx    # Sticky sidebar & mobile filter drawer
│   │   │   ├── DualRangeSlider.tsx  # Dual-handle range slider with independent thumbs
│   │   │   ├── ProductGrid.tsx      # Responsive product grid
│   │   │   ├── ProductCard.tsx      # Product card with image, category, price & rating
│   │   │   ├── SortDropdown.tsx     # Sort By dropdown
│   │   │   ├── LoadingSkeleton.tsx  # Pulse skeleton loading placeholder
│   │   │   └── EmptyState.tsx       # "No items match your criteria." + Reset button
│   │   ├── hooks/
│   │   │   └── useDebounce.ts       # Debounce hook for slider request throttling
│   │   ├── services/
│   │   │   └── api.ts               # Backend API communication client
│   │   ├── types/
│   │   │   └── product.ts           # TypeScript interfaces
│   │   ├── App.tsx                  # Root state management & layout
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Tailwind directives & custom dual slider styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── scripts/
│   └── test_e2e.py              # Automated 54-assertion E2E test runner
├── .gitignore
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

---

### Step 1: Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

The backend API will be live at: `http://127.0.0.1:8000`  
Interactive Swagger documentation is available at: `http://127.0.0.1:8000/docs`

---

### Step 2: Frontend Setup (React + Vite)

1. In a separate terminal, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend application will be live at: `http://127.0.0.1:5173`

---

## 📡 API Reference

### 1. `GET /api/health`
Health check endpoint.
```json
{
  "status": "ok",
  "service": "ecommerce-catalog-api"
}
```

### 2. `GET /api/meta`
Returns category list and global price extremes.
```json
{
  "categories": ["Apparel", "Electronics", "Footwear"],
  "min_price": 14.99,
  "max_price": 799.00,
  "total_products": 24
}
```

### 3. `GET /api/products`
Retrieves filtered and sorted products.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `category` | `string[]` | No | One or more categories (multi-value query param) |
| `min_price`| `float` | No | Minimum price boundary (inclusive) |
| `max_price`| `float` | No | Maximum price boundary (inclusive) |
| `min_rating`| `float` | No | Minimum star rating boundary (1 to 5) |
| `sort_by` | `string` | No | `default`, `price_asc`, or `rating_desc` |

**Example Request**:
```http
GET /api/products?category=Electronics&category=Footwear&min_price=50&max_price=250&min_rating=4.5&sort_by=price_asc
```

---

## 🧪 Testing and Verification

### Run Backend Unit Tests (14 Tests)
Tests dataset loading, filtering rules (OR/AND logic), boundary inclusion, sorting behavior, and dataset immutability:
```bash
python backend/test_backend.py
```
*Result*: `14 passed in 0.004s`

### Run End-to-End Integration Tests (54 Assertions)
Validates the live API endpoints, sorting logic, empty state handling, and error response validation:
```bash
python scripts/test_e2e.py
```
*Result*: `54/54 PASSED (100% SUCCESS)`

### Production Build Verification
To verify the production build of the frontend application:
```bash
cd frontend
npm run build
```
*Result*: Clean compilation, `0` TypeScript errors.

---

## 📄 License
MIT
