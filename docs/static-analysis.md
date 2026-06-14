# Static Analysis Report

**Tool:** ESLint 9.15 (flat config, `eslint.config.js`)
**Target:** `backend/` (Node.js, ES modules)
**Command:** `npm run lint`

Static analysis inspects the source **without executing it**, flagging unused
code, undeclared globals, unreachable statements, and risky constructs.

## Initial run — 8 problems (2 errors, 6 warnings)

| File | Rule | Finding | Resolution |
|------|------|---------|------------|
| `utils/paypal.js` (x2) | `no-undef` | `fetch` not defined | **False positive** — `fetch` is a Node 18+ global; added to ESLint `globals`. |
| `middleware/errorMiddleware.js` | `prefer-const` | `statusCode`, `message` use `let` | Auto-fixed (`--fix`) to `const`. |
| `middleware/authMiddleware.js` | `prefer-const` | `token` never reassigned | Fixed: merged declaration + assignment into `const token = req.cookies.jwt`. |
| `seeder.js` | `no-unused-vars` | `mongoose` imported but unused | Fixed: removed the dead import. |
| `seeder.js` | `no-unused-vars` | `colors` import unused | Fixed: changed to a side-effect import `import 'colors'` (it patches `String.prototype`). |
| `middleware/errorMiddleware.js` | `no-unused-vars` | `next` unused | **Intentional** — Express identifies an error handler by its 4-argument arity, so the parameter must stay. Left as a documented, justified warning. |

## Final run — 1 problem (0 errors, 1 warning)

```
backend/middleware/errorMiddleware.js
  7:38  warning  'next' is defined but never used  no-unused-vars

✖ 1 problem (0 errors, 1 warning)
```

`npm run lint` exits `0` (ESLint fails only on errors). The single remaining
warning is the justified Express signature above.

## Security note
The `no-undef` review also surfaced that user input flowed into a MongoDB
`$regex` unescaped — see **BUG-001** (regex injection), found during this pass
and fixed with an accompanying regression test.
