# BUG-001 — Product search crashes on regex metacharacters (regex injection)

- **Severity:** High (unhandled 500 + regex-injection / ReDoS risk)
- **Component:** `backend/controllers/productController.js` → `getProducts`
- **Status:** Fixed
- **Found by:** Integration test `productRoutes.test.js → "BUG-001 regression"`,
  corroborated by static-analysis review of untrusted input usage.

## Description
The search handler builds a MongoDB query by injecting the raw user-supplied
keyword directly into a `$regex`:

```js
$regex: req.query.keyword, $options: 'i'
```

Because the value is used as a regular expression with no escaping, a keyword
containing regex metacharacters produces an **invalid pattern**. MongoDB throws,
the async error reaches the global error handler, and the request fails with
**HTTP 500**. It is also a regex-injection / ReDoS vector: a crafted pattern can
force pathological matching.

## Steps to reproduce
1. `GET /api/products?keyword=(`  (URL-encoded `%28`).
2. **Expected:** HTTP 200 with a (possibly empty) product list.
3. **Actual (before fix):** HTTP 500.

Verified by the failing test: `expected 500 to be 200`.

## Root cause
Untrusted input used directly as a regular expression without sanitisation.

## Fix
Escape regex metacharacters before constructing the pattern:

```js
$regex: req.query.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
$options: 'i',
```

## Verification
`npm run test:integration` — the regression test now returns HTTP 200; the full
suite is green. The query is treated as a literal substring match, removing both
the crash and the injection vector.
