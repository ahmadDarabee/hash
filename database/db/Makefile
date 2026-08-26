DBUSER= hash
DBNAME=	hash
DBHOST=	localhost
DBPORT=	5432
DBPASS=	hash123
PSQLOP = PGOPTAIONS='--client-min-messages' PGPASSWORD=$(DBPASS)
PSQL_FLAGES = -X -qAt -b -v ON_ERROR_STOP=1
PSQL = $(PSQLOP) psql $(PSQL_FLAGES) -h $(DBHOST) -U $(DBUSER) -p $(DBPORT) -d $(DBNAME)
CREATEDB = PGPASSWORD=$(DBPASS) createdb -h $(DBHOST) -U $(DBUSER) -p $(DBPORT)
DROPDB = PGPASSWORD=$(DBPASS) dropdb -h $(DBHOST) -U $(DBUSER) -p $(DBPORT)

all: createdb provision seed

createdb: 
	@echo "creating db.."
	@ $(CREATEDB) $(DBNAME)
	@ $(PSQL) -f roles.ddl

provision:
	@echo "provisioning database..."
	@ $(PSQL) -f schema.ddl -f view.ddl 
