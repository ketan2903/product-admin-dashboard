# Product Admin Dashboard

A small admin dashboard built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON API](https://dummyjson.com).

Live Demo: [Vercel / Netlify Link](https://your-deployment-url.vercel.app)  
Repository: [GitHub Repository](https://github.com/your-username/nexgensis-product-admin)

---

## 🚀 Features Finished & Implemented

### 1. 🔐 Authentication & Session Security
- **Login Page (`/login`)**: Authenticates against `POST https://dummyjson.com/auth/login`.
- **Demo Credentials Quick-Fill**: Pre-configured with `emilys` / `emilyspass`.
- **Form Validation & Error States**: Displays friendly alerts for invalid credentials or network errors.
- **Route Guarding (`AuthGuard`)**: Protects all product routes (`/`, `/products/[id]`) and redirects unauthenticated requests to `/login`.
- **Persistent Sessions**: Stores authentication token and user data in `localStorage` with automatic restore on reload.
- **Logout Action**: Securely clears credentials and redirects to login.
- **Anti-Spam Lock**: Disables login button while authenticating to prevent repeated API calls.

### 2. 📦 Product Management & Responsive Views
- **Desktop Table View**: Clean table displaying thumbnail image, title & brand, category, price, discount percentage, rating badge, stock status badge, and quick actions.
- **Mobile / Tablet Card Grid**: Responsive card layout optimized for smaller viewports.
- **Product Details (`/products/[id]`)**:
  - Image gallery with interactive thumbnail selector and zoom hover.
  - Complete product specifications (price, discount, stock, SKU, tags).
  - Shipping, warranty, and return policy details.
  - Formatted customer reviews list with star ratings and reviewer comments.
  - Custom 404 Not Found state for invalid IDs or removed products.

### 3. 🔍 Search, Filter & Sort
- **Debounced Search (`/products/search?q=`)**: 400ms debounce ensures requests are only sent after user pauses typing.
- **Race Condition Prevention**: Employs `AbortController` so older slow responses (e.g. `&delay=2000`) never overwrite newer results.
- **Category Filter (`/products/categories`)**: Dynamic category dropdown fetched directly from the API.
- **Multi-criteria Sorting**: Sort by price (low-high, high-low), rating (high-low, low-high), or title (A-Z, Z-A).
- **Auto-reset to Page 1**: Automatically resets to page 1 whenever search, category, or sorting filters change.

### 4. 📄 Custom Pagination & URL State Synchronization
- **Zero Heavy Table/Pagination Libraries**: 100% custom-written pagination and table logic.
- **Page Size Selector**: Switch between 10, 20, and 50 items per page.
- **Smart Page Numbers**: Intelligent windowing with ellipses (`1 ... 4 5 6 ... 20`).
- **Informative Summary**: "Showing 21-40 of 194 products".
- **URL Parameter Sync**: Keeps `page`, `limit`, `q`, `category`, `sortBy`, and `order` synced in the browser address bar for shareable and bookmarkable links.
- **Safe Param Parsing**: Invalid query values like `?page=abc` or `?page=999` are sanitized without crashing or breaking.

### 5. 🛠️ Add, Edit, and Delete with Local State Overlay
- **Add Product Modal**: Full client-side validation (title, category, price > 0, stock >= 0, description, optional image URL).
- **Edit Product Modal**: Pre-populated with existing product data.
- **Delete Confirmation Modal**: Confirmation dialog before deletion.
- **Local Persistence Overlay**: Since DummyJSON does not persist mutations on their server, our app maintains a client overlay layer (`ProductContext`) in memory and `sessionStorage`. Newly created, modified, and deleted items reflect in the UI immediately.

### 6. 🎨 Feedback, Loading & Error States
- **Skeleton Loaders**: Polished skeleton loading for tables and cards.
- **Toast Notifications**: Built-in non-intrusive toast messages for success, error, and info updates.
- **Empty States**: Helpful message with a "Reset Filters" button when no products match.
- **Error States**: Clear error message with a "Retry" button.

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
│   ├── (dashboard)/
│   │   ├── page.tsx            # Main Products Inventory Dashboard
│   │   └── products/[id]/      # Product Details Page
│   ├── login/                  # Login Page
│   ├── error.tsx               # Global Error Boundary
│   ├── not-found.tsx           # Global 404 Page
│   ├── layout.tsx              # Root Layout with Context Providers
│   └── globals.css             # Tailwind Directives & Animations
├── components/
│   ├── auth/AuthGuard.tsx      # Route Protection Guard
│   ├── common/                 # Reusable UI (Button, Input, Modal, Badge, Loader, etc.)
│   ├── layout/                 # Navbar & Footer
│   └── products/               # Product Table, Grid, Filters, Pagination, Modals
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

## 📋 Setup & Installation

### Prerequisites
- Node.js 18.17+ or 20+
- npm / yarn / pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-username/nexgensis-product-admin.git
cd nexgensis-product-admin
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
- **Centralized Axios Interceptor (`src/lib/axios.ts`)**: Rather than configuring tokens per API call, an Axios request interceptor attaches `Authorization: Bearer <token>` automatically. A response interceptor handles 401 Unauthorized errors globally and redirects expired sessions cleanly.
- **No Third-Party Table / State Libraries**: React Query, SWR, and DataGrid libraries were intentionally omitted in accordance with the assignment requirements. All pagination, table rendering, debouncing, and caching layers are custom-built.
- **Decoupled API Services (`src/services/`)**: Component code never contains direct API calls or URL strings.

### 2. Handling DummyJSON Search + Category Constraint
- **Problem**: The DummyJSON API does not support combining `/products/search?q=` and `/products/category/{category}` in a single endpoint.
- **Solution**: When both a search query and a category filter are present, the application fetches the search results from the API and applies the category filter client-side. A user notification explains this behavior.

### 3. Handling API Mutation Simulation
- **Problem**: DummyJSON returns mock response objects for `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id`, but does not save changes in its database.
- **Solution**: Implemented an overlay layer (`ProductContext`) backed by `sessionStorage`. When a user adds, edits, or deletes a product, the app makes the real API call and persists the resulting state locally.

### 4. Race Condition Fix for Fast Typing
- **Problem**: When a user types quickly, an earlier slow request (e.g. with network latency or `&delay=2000`) could finish after a newer request, overwriting newer search results with old data.
- **Solution**: Utilized `AbortController` coupled with a custom `useDebounce` hook. Every new search query immediately aborts any in-flight Axios request before launching the new request.

### 5. Role of AI Tools
- **Where AI helped**: AI assisted in scaffolding boilerplate structures, crafting TypeScript data contracts for the DummyJSON API responses, structuring modular Tailwind component variants, and verifying edge-case handling (such as invalid query parameter sanitization and Suspense boundary integration for Next.js App Router static compilation).
- **Understanding & Verification**: Every component, hook, and interceptor was manually reviewed, typed, verified with production builds (`npm run build`), and structured for maintainability.
