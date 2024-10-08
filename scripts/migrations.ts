import { execSync } from 'node:child_process'

const requerSSL = process.env.POSTGRES_SSL === 'true'

function runPrisma(command: string, schema: string) {
  const dbURL = requerSSL ? `${process.env.POSTGRES_URL}&schema=${schema}` : `${process.env.POSTGRES_URL}?schema=${schema}`
  console.log(`SSL enabled: ${requerSSL}`)
  console.log(process.env.POSTGRES_SSL)
  const env = {
    ...process.env,
    POSTGRES_URL: dbURL
  }
  try {
    console.log(
      `Running Prisma ${command} for schema ${schema}`,
      env.POSTGRES_URL
    )
    execSync(`npx prisma ${command}`, {
      stdio: 'inherit',
      env
    })
    // biome-ignore lint/correctness/noUnreachable: <explanation>
  } catch (error) {
    console.error(`Error running command for schema ${schema}: ${error}`)
  }
}

function manageMigrations(command: string) {
  const schemas = process.env.PRISMA_SCHEMAS?.split(',')
  if (schemas) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i]
      runPrisma(command, schema)
    }
  } else {
    console.error('No schemas defined in PRISMA_SCHEMAS environment variable')
  }
}

const command: string = process.argv[2]
if (!command) {
  console.error(
    'Please provide a command: migrate, generate, introspect, or migrate dev.'
  )
  process.exit(1)
}

manageMigrations(command)
