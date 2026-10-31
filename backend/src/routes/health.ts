import { Router } from 'express'

export const healthRouter = Router()

// Sirve para comprobar que el backend está funcionando
healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok' })
})
