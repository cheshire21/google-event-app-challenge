// Override database host for local e2e test execution.
// The .env file uses POSTGRES_HOST=postgres (Docker service name).
// When tests run outside Docker, the DB is reachable at localhost.
process.env['POSTGRES_HOST'] = 'localhost';
process.env['DATABASE_URL'] =
  'postgresql://postgres:postgres@localhost:5432/google_events_db?schema=public';
