# ProShop — Software Verification, Validation & Testing (IT 303)

A verification & testing project built on **ProShop**, an open-source
**MERN** (MongoDB, Express, React, Node) e-commerce platform. This repository
forks the original application and adds a full testing stack: static analysis,
unit, integration and system (end-to-end) tests, coverage analysis, a
documented bug fix with a regression test, and CI.

- **Live app:** https://proshop-svvt.onrender.com
- **Author of SVVT work:** Hena Potogija
- **Original application:** [bradtraversy/proshop-v2](https://github.com/bradtraversy/proshop-v2) by Brad Traversy — **MIT License** (see [`LICENSE`](./LICENSE) and the preserved [`docs/ORIGINAL_PROSHOP_README.md`](./docs/ORIGINAL_PROSHOP_README.md)).

## Application functionality
Full storefront: product catalog with search & pagination, product details and
reviews, shopping cart, JWT-cookie authentication (register / login), multi-step
checkout (PayPal **sandbox** — no real charges), order history, and an admin
area for product/user/order management.

## Modifications made for this project
- Extracted an importable Express app (`backend/app.js`) so the API can be
  integration-tested with Supertest (`server.js` keeps DB + port wiring).
- Added test tooling: Vitest, Supertest, `mongodb-memory-server`, ESLint,
  Playwright.
- **Bug fix BUG-001:** sanitized the product-search `$regex` (regex-injection /
  HTTP 500). See [`docs/bugs`](./docs/bugs).
- Code-quality fixes surfaced by ESLint (see [`docs/static-analysis.md`](./docs/static-analysis.md)).

## Testing strategy
| Activity | Tool | Where | Run |
|----------|------|-------|-----|
| Static analysis | ESLint 9 | `backend/`, `eslint.config.js` | `npm run lint` |
| Unit tests (BVA, equivalence partitioning, decision tables) | Vitest | `backend/__tests__/unit` | `npm run test:unit` |
| Integration tests (HTTP API + in-memory MongoDB) | Vitest + Supertest | `backend/__tests__/integration` | `npm run test:integration` |
| Coverage analysis | Vitest + v8 | `coverage/` | `npm run test:coverage` |
| System / E2E (black-box, desktop + mobile) | Playwright | `tests/e2e` | `npm run test:e2e` |
| Regression | GitHub Actions | `.github/workflows/ci.yml` | on every push |

Full plan and test-case design: [`docs/test-plan.md`](./docs/test-plan.md).

Current status: **21** unit + integration tests and **12** E2E checks
(2 viewports) passing; key backend modules covered.

## Running the application

Requires **Node.js 20** and a **MongoDB** connection (MongoDB Atlas free tier
works well).

```bash
# 1. Backend deps (repo root) and frontend deps
npm install
npm install --prefix frontend

# 2. Configure environment — copy and fill in MONGO_URI + JWT_SECRET
cp .env.example .env

# 3. Seed sample products and users
npm run data:import

# 4. Run backend (:5000) + frontend (:3000)
npm run dev
```

Seeded sample accounts (from `backend/data/users.js`):
`admin@email.com` / `123456` (admin) and `john@email.com` / `123456` (customer).

## Running the tests

```bash
npm run lint            # static analysis
npm test                # unit + integration (Vitest)
npm run test:coverage   # + coverage report in ./coverage
npm run test:e2e        # Playwright system tests (auto-starts the dev server)
```

To run the E2E suite against the deployed site instead of localhost:

```bash
PLAYWRIGHT_BASE_URL=https://<your-render-url> npm run test:e2e
```

## Documentation
- [`docs/test-plan.md`](./docs/test-plan.md) — strategy & test-case design
- [`docs/static-analysis.md`](./docs/static-analysis.md) — ESLint findings
- [`docs/bugs/`](./docs/bugs) — bug reports & fixes
