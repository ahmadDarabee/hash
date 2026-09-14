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

FEATURE_FILES := $(shell find features -type f -name '*.ddl' | sort)

.PHONY: all createdb provision provision-all clean list

all: provision-all

createdb:
	@echo "▶ creating db $(DBNAME) ..."
	@ $(CREATEDB) $(DBNAME)
	@ echo "▶ applying roles ..."
	@ $(PSQL) -f roles.ddl -f create.ddl
	@ echo "▶ pinning default timezone to UTC ..."
	@ $(PSQL) -c "ALTER DATABASE $(DBNAME) SET timezone TO 'UTC';"

provision: createdb
	@echo "▶ provisioning common objects ..."
	@ $(PSQL) -f common/setup.ddl -f common/functions.ddl

provision-all: provision
	@echo "▶ provisioning $(words $(FEATURE_FILES)) feature file(s) ..."
	@for f in $(FEATURE_FILES); do \
		echo "  → $$f"; \
		$(PSQL) -f "$$f" || exit 1; \
	done
	@echo "✅ done."

list:
	@for f in $(FEATURE_FILES); do echo "  $$f"; done

dropdb:
	@echo "▶ dropping db $(DBNAME) ..."
	@ $(DROPDB) --if-exists $(DBNAME)
