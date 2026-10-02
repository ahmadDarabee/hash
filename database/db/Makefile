DBUSER  = hash
DBNAME  = hash
DBHOST  = localhost
DBPORT  = 5432
DBPASS  = hash123

PSQL_ENV = PGTZ=UTC PGPASSWORD=$(DBPASS)
PSQL_FLAGS = -X -b -v ON_ERROR_STOP=1
PSQL = $(PSQL_ENV) psql $(PSQL_FLAGS) \
         -h $(DBHOST) -U $(DBUSER) -p $(DBPORT) -d $(DBNAME)
CREATEDB = $(PSQL_ENV) createdb -h $(DBHOST) -U $(DBUSER) -p $(DBPORT)
DROPDB   = $(PSQL_ENV) dropdb   -h $(DBHOST) -U $(DBUSER) -p $(DBPORT)

# Explicit application order. Position matters: tables referenced by a later
# feature must already exist when that feature is provisioned.
FEATURE_ORDER := app_user auth catalog pricing inventory compliance order quote

# Per-feature file order: functions before setup (declarations before use),
# triggers after setup (tables must exist), views last.
FEATURE_FILE_ORDER := functions.ddl setup.ddl triggers.ddl views.ddl

FEATURE_FILES := $(foreach f,$(FEATURE_ORDER),\
                   $(foreach g,$(FEATURE_FILE_ORDER),\
                     $(wildcard features/$(f)/$(g))))

MIGRATIONS := $(wildcard schema-migrations/*.sql)
SEEDS      := $(wildcard seeds/*.sql)

.PHONY: all createdb provision provision-all migrate seed dropdb clean list list-order

all: provision-all

createdb:
	@echo "[createdb] $(DBNAME)"
	@ $(PSQL_ENV) psql -X -h $(DBHOST) -U $(DBUSER) -p $(DBPORT) -d postgres \
	    -tc "SELECT 1 FROM pg_database WHERE datname = '$(DBNAME)'" | grep -q 1 \
	    || $(CREATEDB) $(DBNAME)
	@ echo "[roles + extensions]"
	@ $(PSQL) -f roles.ddl -f create.ddl
	@ echo "[timezone]"
	@ $(PSQL) -c "ALTER DATABASE $(DBNAME) SET timezone TO 'UTC';"

provision: createdb
	@echo "[common objects]"
	@ $(PSQL) \
	    -f common/functions.ddl \
	    -f common/setup.ddl \
	    -f common/views.ddl

provision-all: provision
	@echo "[features] applying $(words $(FEATURE_FILES)) file(s)..."
	@for f in $(FEATURE_FILES); do \
		echo "  -> $$f"; \
		$(PSQL) -f "$$f" || exit 1; \
	done
	@ echo "[common triggers]"
	@ $(PSQL) -f common/triggers.ddl
	@echo "[done]"

migrate:
	@echo "[migrations] applying $(words $(MIGRATIONS)) file(s)..."
	@for f in $(MIGRATIONS); do \
		echo "  -> $$f"; \
		$(PSQL) -f "$$f" || exit 1; \
	done

seed:
	@echo "[seed] applying $(words $(SEEDS)) file(s)..."
	@for f in $(SEEDS); do \
		echo "  -> $$f"; \
		$(PSQL) -f "$$f" || exit 1; \
	done

list-order:
	@echo "feature order: $(FEATURE_ORDER)"
	@echo
	@echo "files (in application order):"
	@for f in $(FEATURE_FILES); do echo "  $$f"; done

list: list-order

dropdb:
	@echo "[dropdb] $(DBNAME)"
	@ $(DROPDB) --if-exists $(DBNAME)

clean: dropdb
