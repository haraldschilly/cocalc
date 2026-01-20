## 2026-01-20 - SQL Injection in Dynamic Table Names
**Vulnerability:** Found a SQL injection vulnerability in `src/packages/database/postgres-server-queries.coffee` where `opts.log` was interpolated directly into a query string: `"SELECT * FROM #{opts.log}"`.
**Learning:** CoffeeScript string interpolation combined with dynamic table names is a risky pattern that bypasses parameterization. Standard prepared statements cannot parameterize identifiers (table/column names).
**Prevention:** Always use an allowlist (whitelist) for any dynamic identifiers (tables, columns) before interpolating them into SQL queries.
