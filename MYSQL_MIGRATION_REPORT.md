# Neon PostgreSQL to Hostinger MySQL Migration Report

Date: 2026-10-08

## Outcome

The 22 application tables were created in the verified Hostinger MySQL database and all 108 records from the Neon PostgreSQL backup were imported. A final field-by-field comparison passed for every record, and every declared foreign-key path has zero orphaned rows.

The Neon database was not modified or deleted. The local source export remains in the git-ignored `backups/neon-migration/` directory with per-table JSON files, source schema metadata, row counts, a manifest, and SHA-256 hashes.

## Record verification

| Table | Neon backup | Hostinger MySQL | Values match |
|---|---:|---:|:---:|
| AdminAccountRequest | 0 | 0 | Yes |
| AdminUser | 1 | 1 | Yes |
| Author | 0 | 0 | Yes |
| BlogPost | 3 | 3 | Yes |
| Category | 8 | 8 | Yes |
| Certificate | 4 | 4 | Yes |
| Collection | 4 | 4 | Yes |
| Customer | 0 | 0 | Yes |
| CustomerActivity | 0 | 0 | Yes |
| HeroSlide | 2 | 2 | Yes |
| HomepageSection | 2 | 2 | Yes |
| Inquiry | 0 | 0 | Yes |
| MediaAsset | 51 | 51 | Yes |
| NavigationMenu | 1 | 1 | Yes |
| Order | 1 | 1 | Yes |
| PasswordChangeRequest | 0 | 0 | Yes |
| Product | 16 | 16 | Yes |
| ProductVariation | 0 | 0 | Yes |
| Review | 5 | 5 | Yes |
| SiteSetting | 5 | 5 | Yes |
| Video | 5 | 5 | Yes |
| WishlistItem | 0 | 0 | Yes |
| **Total** | **108** | **108** | **Yes** |

## Relationship verification

All orphan counts were zero for:

- ProductVariation → Product
- AdminAccountRequest → AdminUser
- PasswordChangeRequest → AdminUser
- Order → Customer
- WishlistItem → Customer
- WishlistItem → Product
- CustomerActivity → Customer
- BlogPost → Author

## Compatibility work

- Changed the Prisma datasource provider from `postgresql` to `mysql`.
- Added explicit `Text`, `LongText`, and `VarChar(2048)` native types where MySQL's default `VarChar(191)` could truncate content or URLs.
- Preserved IDs, timestamps, JSON values, enums, defaults, mapped columns, indexes, unique constraints, relations, and referential actions.
- Removed PostgreSQL-only Prisma `mode: "insensitive"` search options. Hostinger MySQL uses case-insensitive collation for these string searches.
- Added rerunnable import, backup-integrity, migration-verification, and rollback-only smoke-test scripts under `scripts/database-migration/`.

## Test results

| Test | Result |
|---|---|
| Target TCP connectivity | Pass |
| MySQL authentication | Pass |
| Target initially empty | Pass |
| Backup integrity and hashes | Pass: 22 tables / 108 rows |
| `npx prisma validate` | Pass |
| `npx prisma generate` | Pass |
| `npx prisma db push` | Pass |
| Field-by-field source/target comparison | Pass |
| Foreign-key orphan checks | Pass |
| Core database reads | Pass |
| Create/read/update/delete transaction | Pass; rolled back |
| Relation and cascade behavior | Pass; rolled back |
| `npm run typecheck` | Pass |
| Production build | Pass; all 88 static pages generated |
| ESLint | Existing unrelated lint debt remains: 44 errors and 20 warnings |

## Remaining issues and operational notes

- The previous Neon connection string was overwritten in `.env` before target verification and is not stored in the repository, so it could not be reconstructed as `OLD_DATABASE_URL`. Neon remains untouched, and the complete verified local backup is retained as the rollback dataset.
- The existing historical files under `prisma/migrations/` contain PostgreSQL SQL. Continue using the validated MySQL Prisma schema with `prisma db push`, or create a new MySQL migration baseline before using `prisma migrate deploy`.
- Prisma warns that the generator should receive an explicit output path before Prisma 7. This does not affect the current Prisma 6 migration.
- Next.js warns that the `middleware` convention is deprecated in favor of `proxy`. This does not affect the database migration.
- Credentials and exported data are intentionally excluded from version control.
