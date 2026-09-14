import { createHash } from 'node:crypto'

const command = process.argv.slice(2).join(' ')
if (!command) {
  console.error('Usage: pnpm admin:hash-command "your private publish command"')
  process.exit(1)
}

console.log(createHash('sha256').update(command).digest('hex'))
