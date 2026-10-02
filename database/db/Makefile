# Hash database tasks. Requires psql/pg_dump on PATH.
DBUSER ?= hash
DBNAME ?= hash
DBHOST ?= localhost
DBPORT ?= 5432
DBPASS ?= hash123

export PGPASSWORD := $(DBPASS)

PSQL = psql -X -v ON_ERROR_STOP=1 -h $(DBHOST) -U $(DBUSER) -p $(DBPORT) -d $(DBNAME)

MIGRATIONS := $(shell find migrations -type f -name '*.sql' | sort)
SEEDS := $(shell find seeds -type f -name '*.sql' | sort)

.PHONY: migrate seed reflect provision

# Apply migrations in order (idempotent files make re-runs safe).
migrate:
	@for f in $(MIGRATIONS); do echo "  -> $$f"; $(PSQL) -f "$$f" || exit 1; done

# Load reference data.
seed:
	@for f in $(SEEDS); do echo "  -> $$f"; $(PSQL) -f "$$f" || exit 1; done

# Reflect the live schema into the master DDL file.
reflect:
	pg_dump --schema-only --no-owner --no-privileges \
		-h $(DBHOST) -U $(DBUSER) -p $(DBPORT) $(DBNAME) > schema.ddl.sql
	@echo "schema.ddl.sql updated."

provision: migrate seed reflect
