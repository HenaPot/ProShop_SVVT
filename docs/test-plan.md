# Test Plan & Test Case Design

Project: **ProShop (MERN e-commerce)** — IT 303 SVVT
System under test: forked, self-hosted ProShop. Public live URL in the README.

## 1. Strategy overview

| Level | Technique | Tooling | Location |
|-------|-----------|---------|----------|
| Static analysis | Linting / code review | ESLint 9 | `docs/static-analysis.md` |
| Unit | BVA, equivalence partitioning, decision table | Vitest | `backend/__tests__/unit` |
| Integration | API contract, auth, error paths | Vitest + Supertest + in-memory MongoDB | `backend/__tests__/integration` |
| System (E2E) | Black-box, user journeys | Playwright | `tests/e2e` |
| Coverage | Statement/branch coverage | Vitest + v8 | `coverage/` |
| Regression | Re-runnable suites + CI | GitHub Actions | `.github/workflows/ci.yml` |

## 2. Unit test cases — `calcPrices()` (pricing logic)

Rules under test: `shipping = (itemsPrice > 100) ? 0 : 10`; `tax = 15% * itemsPrice`;
`total = items + shipping + tax`.

### Equivalence partitioning
| Partition | Representative | Expected shipping |
|-----------|----------------|-------------------|
| Empty cart | `[]` (items = 0) | 10 |
| Below threshold | items = 50 | 10 |
| Above threshold | items = 150 | 0 |

### Boundary value analysis (threshold = 100)
| itemsPrice | Expected shipping | Note |
|-----------|-------------------|------|
| 99.99 | 10 | just below |
| **100.00** | **10** | on boundary — rule is strictly `> 100` |
| 100.01 | 0 | just above |

### Decision table (free-shipping rule)
| Condition: itemsPrice > 100 | Action: shippingPrice |
|---|---|
| F | 10 |
| T | 0 |

Worked examples asserted: items 50 → total 67.50; items 150 → total 172.50;
mixed line items 60 → total 79.00; output always `^\d+\.\d{2}$`.

## 3. Integration test cases (HTTP API)

| # | Endpoint | Scenario | Expected |
|---|----------|----------|----------|
| P1 | `GET /api/products` | list seeded products | 200, paginated `{products,page,pages}` |
| P2 | `GET /api/products?keyword=` | case-insensitive name filter (hit/miss) | 200, filtered |
| P3 | `GET /api/products?keyword=(` | **regex metacharacter (BUG-001)** | 200, no crash |
| P4 | `GET /api/products/:id` | valid id | 200, single product |
| P5 | `GET /api/products/:id` | invalid ObjectId | 404 |
| P6 | `GET /api/products/:id` | valid-but-missing id | 404 "not found" |
| P7 | `POST /api/products` | unauthenticated create | 401 |
| U1 | `POST /api/users` | register new user | 201, jwt cookie, no password leaked |
| U2 | `POST /api/users` | duplicate email | 400 "already exists" |
| U3 | `POST /api/users/auth` | correct credentials | 200 |
| U4 | `POST /api/users/auth` | wrong password | 401 |
| U5 | `GET /api/users/profile` | no token | 401 "not authorized" |
| U6 | profile update then re-login | password integrity | 200 (guards the userModel fix) |

## 4. System (E2E) test cases — Playwright

| # | Journey | Expected |
|---|---------|----------|
| E1 | Home loads, products visible | header + product cards render |
| E2 | Search by keyword | results page filtered |
| E3 | Open product detail | name, price, Add-to-Cart present |
| E4 | Add to cart → cart page | item + subtotal shown |
| E5 | Register a new account | lands authenticated |
| E6 | Login as seeded user, then logout | auth state toggles |

E2E is black-box against the deployed/running app; no test places a real
payment (PayPal stays on sandbox).

## 5. Exit criteria
- Unit + integration suites green in CI.
- Coverage report generated; critical modules (pricing, auth, routing) covered.
- All documented bugs have a failing-then-passing regression test.
