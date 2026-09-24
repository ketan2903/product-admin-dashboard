# Nexgensis Product Admin Dashboard

A high-performance, enterprise-grade Product Admin Dashboard built with **Next.js 14 (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON API](https://dummyjson.com).

🔗 **Live Production URL**: [https://product-admin-dashboard-teal.vercel.app/](https://product-admin-dashboard-teal.vercel.app/)  
📦 **GitHub Repository**: [https://github.com/ketan2903/product-admin-dashboard](https://github.com/ketan2903/product-admin-dashboard)  
🔑 **Demo Admin Credentials**: Username: `emilys` | Password: `emilyspass` (also includes one-click autofill on `/login`)

---

## 🚀 Features Finished & Implemented

### 1. 🔐 Authentication & Session Security
- **Login Portal (`/login`)**: Authenticates against `POST https://dummyjson.com/auth/login`.
- **Demo Credentials Autofill**: One-click "Use Demo" button instantly fills `emilys` / `emilyspass`.
- **Route Guarding (`AuthGuard`)**: Protects all internal dashboard routes (`/`, `/products/[id]`) and redirects unauthenticated visitors to `/login` with return URL memory.
- **Synchronous Token Hydration**: Eliminates flashing "Verifying session..." screens on page refresh.
- **Centralized Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to outbound requests and handles 401 Unauthorized / token expiration.
- **Logout Action**: Clears authentication tokens and redirects safely.

### 2. 📦 Product Management & Responsive Views
- **Desktop Table View**: Rich data table displaying thumbnail preview, title, category, price, discount badge, rating badge, stock quantity badge, and quick actions (View, Edit, Delete).
- **Mobile / Tablet Card Grid**: Tailored card layout optimized for smaller touch devices.
- **Product Details View (`/products/[id]`)**:
  - **Dynamic Image Gallery**: Auto-advancing slideshow (every 3.5s for items with 2+ images), bold `<` and `>` arrow navigation buttons, thumbnail selectors, and hover-to-pause.
  - Complete specifications: category, brand, SKU, discount percentage, stock status, dimensions, and warranty.
  - Customer reviews list with star rating breakdown, reviewer names, and feedback dates.
  - Custom 404 handler for invalid product IDs with a return button.

### 3. 🔍 Search, Filter & Multi-Criteria Sort
- **Debounced Search (`/products/search?q=`)**: 400ms debounce ensures optimal network usage.
- **Race Condition Prevention**: Built with `AbortController` cancellation so fast typing and delayed API responses never overwrite newer results.
- **Custom Searchable Category Filter**: Floating popover select menu with live search filter to quickly find categories among 20+ options.
- **Multi-field Sorting**: Sort by Price (Low to High / High to Low), Rating (High to Low / Low to High), and Title (A to Z / Z to A).
- **Auto-reset to Page 1**: Resets pagination to page 1 upon changing search, category, or sorting parameters.

### 4. 📄 Custom Pagination & URL Synchronization
- **Zero Third-Party Table Libraries**: 100% custom-crafted pagination, sorting, and table rendering (no React Query, SWR, or DataGrid dependencies).
- **Page Size Selector**: Switch between `10 per page`, `20 per page`, and `50 per page`.
- **Smart Windowed Page Numbers**: Ellipsis pagination (`1 ... 4 5 6 ... 20`) with First / Prev / Next / Last quick jumps.
- **Informative Summary**: Real-time counter (e.g. *"Showing 1–10 of 194 products"*).
- **URL Parameter Sync**: Reflects all filter states (`page`, `limit`, `q`, `category`, `sortBy`, `order`) directly in the URL query string for shareable links.

### 5. 🛠️ Add, Edit, and Delete with Local State Overlay
- **Add Product Modal**: Clean structured modal with full input validation (title, category, price > $0, stock >= 0, description, optional image URL).
- **Edit Product Modal**: Pre-populates all existing product values with live mutation support.
- **Delete Confirmation Dialog**: Modal confirmation to prevent accidental item deletion.
- **Client Overlay Store (`ProductContext`)**: Because DummyJSON does not persist mutations to its backend, changes are synchronized with a client overlay layer in `localStorage` so added, updated, and deleted products persist across page reloads and detail views.

### 6. 🎨 Feedback, Loading & Error States
- **Custom Floating Select Menus (`CustomSelect.tsx`)**: Replaces native browser dropdowns with floating menus featuring keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`).
- **Skeleton Loaders**: Content skeleton screens during API requests.
- **Toast Notifications**: Non-intrusive toast alert system for success, error, and info updates.
- **Empty States**: Clear messaging with a "Reset Filters" action when queries return no results.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (with centralized request/response interceptors)
- **Icons**: Lucide React
- **State Management**: React Context API (`AuthContext`, `ProductContext`, `ToastContext`)

### Folder Structure
```
src/
├── app/
│   ├── page.tsx                # Main Products Dashboard
│   ├── products/[id]/          # Product Details Page & Gallery
│   ├── login/                  # Login Page
│   ├── error.tsx               # Global Error Boundary
│   ├── not-found.tsx           # Global 404 Page
│   ├── layout.tsx              # Root Layout with Context Providers
│   └── globals.css             # Tailwind Directives & Animations
├── components/
│   ├── auth/AuthGuard.tsx      # Route Protection Guard
│   ├── common/                 # Reusable UI (CustomSelect, Button, Input, Modal, Badge, Loader, etc.)
│   ├── layout/                 # Navbar & Footer
│   └── products/               # ProductTable, ProductCard, ProductFilters, Pagination, Modals
├── context/
│   ├── AuthContext.tsx         # User session & auth state
│   ├── ProductContext.tsx      # Local mutation overrides & persistence
│   └── ToastContext.tsx        # Toast notification system
├── hooks/
│   ├── useDebounce.ts          # Search input debouncing hook
│   └── useUrlParams.ts         # URL query parameter synchronization
├── lib/
│   ├── axios.ts                # Shared Axios instance & interceptors
│   └── utils.ts                # Formatters, class merge, safe parsing
├── services/
│   ├── authService.ts          # Authentication API calls
│   └── productService.ts       # Product & Category API calls
└── types/                      # TypeScript definitions (auth, product, api)
```

---

## 📋 Setup & Local Installation

### Prerequisites
- Node.js 18.17+ or 20+
- npm / yarn / pnpm

### 1. Clone & Install
```bash
git clone https://github.com/ketan2903/product-admin-dashboard.git
cd product-admin-dashboard
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 💡 Notes on Design Decisions & Problem Solving

### 1. Architectural Choices
- **Centralized Axios Interceptor (`src/lib/axios.ts`)**: Outbound requests automatically carry the `Authorization: Bearer <token>` header. A response interceptor catches 401 Unauthorized errors globally and redirects expired sessions cleanly.
- **Zero Third-Party Table Libraries**: React Query, SWR, and DataGrid libraries were intentionally excluded to build pure, performant custom React components with full TypeScript typing.
- **Decoupled API Services (`src/services/`)**: Component code never contains direct API calls or hardcoded URL strings.

### 2. Handling DummyJSON Search + Category Constraint
- **Problem**: DummyJSON API does not support querying both search (`/products/search?q=`) and category (`/products/category/{category}`) simultaneously in a single endpoint.
- **Solution**: When both a search query and a category filter are active, the application queries the global search endpoint and filters matching items by category client-side with a clear indicator for the user.

### 3. Handling API Mutation Simulation
- **Problem**: DummyJSON returns mock response objects for `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id`, but does not save modifications on its database.
- **Solution**: Implemented an overlay state store (`ProductContext`) backed by `localStorage`. When a user adds, edits, or deletes a product, the app performs the real API request and persists the updated state locally so changes remain visible across navigation and reloads.

### 4. Race Condition Fix for Fast Typing
- **Problem**: When typing quickly in the search box, older slow responses could finish after newer requests and overwrite results.
- **Solution**: Utilized `AbortController` coupled with `useDebounce`. Every new search keystroke cancels previous in-flight Axios requests before issuing a new one.

### 5. Role of AI Tools (AI Usage Report)
- **Where AI helped**: AI assisted in scaffolding initial TypeScript interfaces based on DummyJSON API schemas, generating modular Tailwind utility structures, verifying edge cases (such as query parameter sanitization and Next.js static generation Suspense boundaries), and brainstorming UI component variants.
- **Understanding & Verification**: Every component, custom hook, interceptor, and layout was verified with zero-error production builds (`npm run build`) and tested across desktop and mobile viewports.

