import { spawn } from 'node:child_process'

const children = []
let shuttingDown = false

function launch(command, args, name) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  })
  children.push(child)

  child.on('exit', (code) => {
    if (shuttingDown) return
    shuttingDown = true
    for (const c of children) {
      if (c !== child && !c.killed) {
        c.kill('SIGTERM')
      }
    }
    if (code && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`)
    }
    process.exit(code ?? 0)
  })
}

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(0), 300)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

launch(process.execPath, ['server/index.js'], 'operator-bot')
launch('npx', ['vite', ...process.argv.slice(2)], 'vite')
