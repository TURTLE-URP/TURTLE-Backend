-- Initialization Script 01: Users

-- This script will be executed to do further initialization before starting the postgres service
-- For more information visit: https://hub.docker.com/_/postgres#initialization-scripts

-- 1. The Prisma User: A user that will be used by the prisma client ONLY.
-- Therefore, it will only have the necessary privileges for the tasks it will do.
CREATE USER prisma_dev_user WITH PASSWORD 'prisma';