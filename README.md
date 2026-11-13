# CareerFit E-Commerce Multi-Filter Sidebar Application

A high-performance, modern dark-themed e-commerce product browsing application featuring real-time multi-criteria filtering, server-side sorting, Amazon/Flipkart-style product details, user authentication, and shopping cart checkout. Built from scratch with a **Python FastAPI** backend and a **React 18 + Vite + TypeScript** frontend styled with **Tailwind CSS**.

---

## 🎨 Color Palette & Design Theme

The interface utilizes the signature **CareerFit** dark aesthetic:

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Jet Black** | `#0A0A0A` | Deep dark backgrounds, layout canvas, and high contrast surfaces |
| **Cerulean Blue** | `#007BA7` | Active filter pills, category checkboxes, slider tracks, brand badges |
| **Neon Rose** | `#FF2E63` | Star ratings, highlight badges, reset actions, and checkout CTA buttons |

- **Dark surfaces**: `#121212`, `#141414`, and `#181818` with subtle borders (`#222222`).
- **Currency**: **Indian Rupees (₹)** formatted with Indian locale formatting (`₹{price.toLocaleString('en-IN')}`).
- **Typography**: Clean, crisp typography using the `Inter` font family.
- **Responsiveness**: Desktop sticky sidebar with mobile slide-out drawer panel.

---

## 🚀 Key Features

### 1. Left Sidebar – Multi-Criteria Filters
- **Category Checkboxes**: Multi-select support for `Electronics` (52 items), `Apparel` (54 items), and `Footwear` (53 items) using **OR logic** within categories.
- **Colour Filter**: Multi-select colour filter with visual color swatches (`Black`, `White`, `Blue`, `Red`, `Grey`, `Green`, `Brown`) combined using **OR logic**.
- **Price Range Presets & Dual-Handle Slider**:
  - Quick Select presets: `Below ₹500`, `₹500 – ₹1,000`, `₹1,000 – ₹2,500`, `₹2,500 – ₹5,000`, `₹5,000 – ₹10,000`, `Above ₹10,000`.
  - Synchronized dual-handle continuous range slider with independent min/max handles and debounced requests.
- **Minimum Star Rating Selection**: Interactive radio buttons (1 to 5 stars, plus "All Ratings") filtering products with rating $\ge$ chosen threshold.
- **Sticky Desktop & Collapsible Mobile Panel**: Stays pinned while scrolling on large screens and collapses into a slide-over drawer on mobile devices with an active filter badge.
- **Visible Reset Filters**: One-click restoration of all filter controls to their default state.

### 2. Amazon / Flipkart-Style Product Detail View
- Clicking any item card opens a detailed product inspection modal:
  - High-resolution product image and discount badge (e.g., `20% OFF`).
  - Category, verified authentic stock status, and color variant indicator.
  - Full title, customer star ratings, and review count.
  - Pricing breakdown in INR (`₹`) with simulated MRP strikethrough.
  - Trust perks: Free Delivery, 7-Day Replacement Guarantee, 1-Year Official Warranty.
  - Detailed product overview and key feature specifications.
  - Quantity picker (`-` `qty` `+`).
  - "Add to Cart" and "Buy Now" instant action buttons.

### 3. Shopping Cart Drawer & Checkout
- Slide-over cart drawer from the right side of the screen.
- Real-time line item calculations, quantity adjustment (`+` / `-`), and removal.
- Free delivery on orders ₹499 and above.
- Promo coupon support (try code `"CAREERFIT10"` for 10% discount).
- Checkout order placement via `POST /api/cart/checkout` returning an official `CF-ORD-XXXX` order reference number with order confirmation.
- Persisted cart state in `localStorage`.

### 4. User Authentication (Login & Signup)
- Authentication modal with "Sign In" and "Create Account" tabs.
- 1-click **Demo Login** (`demo@careerfit.com` / `password123`).
- Full-stack registration and login backed by FastAPI endpoints (`/api/auth/signup`, `/api/auth/login`).
- User profile header dropdown with Sign Out action and session persistence.

---

## 🧠 Architecture & Filtering Rules

All filtering, validation, and sorting business logic executes **strictly on the backend**.

```
┌─────────────────────────────────┐        HTTP GET /api/products?        ┌───────────────────────────────────┐
│     React + Vite Frontend       │ ────────────────────────────────────> │       Python FastAPI Backend      │
│  - Categories (multi-select)    │ <──────────────────────────────────── │  1. Load products (immutable)     │
│  - Colours (multi-select)       │        JSON Response {products,       │  2. Category Filter (OR logic)    │
│  - Dual slider / Presets (INR)  │                       total, ...}     │  3. Colour Filter (OR logic)      │
│  - Star rating radio buttons    │                                       │  4. Price Range in ₹ (inclusive)  │
│  - Sort By dropdown             │                                       │  5. Star Rating (>= min_rating)   │
└─────────────────────────────────┘                                       │  6. Combine with AND logic        │
                                                                          │  7. Sort (Price asc / Rating desc)│
                                                                          └───────────────────────────────────┘
```

1. **Category Filtering**: Multiple selected categories use **OR logic**.
2. **Colour Filtering**: Multiple selected colours use **OR logic**.
3. **Price Range Filtering**: Products are included if `min_price <= product.price <= max_price` (inclusive boundaries in INR).
4. **Rating Filtering**: Products are included if `product.rating >= min_rating`.
5. **Combined Logic**: Category, Colour, Price, and Rating criteria are combined using strict **AND logic**.
6. **Execution Order**: Filtering is executed **first**, followed immediately by sorting on the remaining matches.
7. **Dataset Immutability**: The original catalog dataset of 159 products in [`backend/app/data/products.json`](file:///c:/Users/ashwi/OneDrive/Desktop/VibeCoding/backend/app/data/products.json) is never modified in memory.
8. **Empty State**: When no products match criteria, the exact message is displayed:
   `"No items match your criteria."`
   accompanied by a visible **Reset Filters** button.

---

## 📁 Project Structure

```
VibeCoding/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI endpoints (products, auth, cart, meta)
│   │   ├── models.py            # Pydantic data schemas
│   │   ├── services.py          # Filtering, sorting & catalog service
│   │   └── data/
│   │       └── products.json    # 159-product dataset in INR
│   ├── requirements.txt         # Python dependencies
│   └── test_backend.py          # 13 unit test cases
├── frontend/
│   ├── public/
│   │   └── favicon.svg          # CareerFit SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # Brand header with cart badge, auth & mobile toggle
│   │   │   ├── FilterSidebar.tsx    # Sticky sidebar with colour swatches & price presets
│   │   │   ├── DualRangeSlider.tsx  # Dual-handle range slider with ₹ formatting
│   │   │   ├── ProductGrid.tsx      # Responsive product grid
│   │   │   ├── ProductCard.tsx      # Product card with Quick Add & Detail View triggers
│   │   │   ├── ProductDetailModal.tsx # Amazon/Flipkart style detail modal
│   │   │   ├── CartDrawer.tsx       # Shopping cart slide-out with checkout
│   │   │   ├── AuthModal.tsx        # Sign In & Sign Up dialog
│   │   │   ├── SortDropdown.tsx     # Sort By dropdown
│   │   │   ├── LoadingSkeleton.tsx  # Pulse skeleton loading placeholder
│   │   │   └── EmptyState.tsx       # "No items match your criteria." + Reset button
│   │   ├── hooks/
│   │   │   └── useDebounce.ts       # Debounce hook for slider request throttling
│   │   ├── services/
│   │   │   └── api.ts               # Backend API client with fetch
│   │   ├── types/
│   │   │   ├── product.ts           # Product & filter types
│   │   │   ├── cart.ts              # Cart types
│   │   │   └── auth.ts              # User & auth types
│   │   ├── App.tsx                  # Root state management & layout
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Tailwind directives & custom dual slider styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── scripts/
│   ├── generate_dataset.py      # Dataset generation script
│   └── test_e2e.py              # Automated 74-assertion E2E test runner
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

## 🧪 Testing and Verification

### Run Backend Unit Tests (13 Tests)
Tests dataset loading, category OR logic, color OR logic, price boundary inclusion in INR, sorting behavior, and dataset immutability:
```bash
python backend/test_backend.py
```
*Result*: `13 passed in 0.031s`

### Run End-to-End Integration Tests (74 Assertions)
Validates all live API endpoints, 50+ items per category, color filters, INR price boundaries, sorting, empty states, and input validation:
```bash
python scripts/test_e2e.py
```
*Result*: `74/74 PASSED (100% SUCCESS)`

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
