import { Elysia } from 'elysia'

const app = new Elysia()

app.get('/', () => 'hello from elysia')

app.listen(3000)

console.log('server running on http://localhost:3000')
