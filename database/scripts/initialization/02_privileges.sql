-- 2. Required for prisma migrate dev (creates the shadow database)
ALTER ROLE prisma_dev_user WITH CREATEDB;

-- 3. Grant access to your database
GRANT ALL PRIVILEGES ON DATABASE turtle TO prisma_dev_user;

-- 4. Grant access to the public schema
GRANT ALL ON SCHEMA public TO prisma_dev_user;

-- 5. Grant access to existing tables, sequences and functions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prisma_dev_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prisma_dev_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO prisma_dev_user;

-- 6. Ensure future tables created by migrations are also accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO prisma_dev_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO prisma_dev_user;