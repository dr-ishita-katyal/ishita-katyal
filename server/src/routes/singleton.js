import { Router } from 'express';
import { singletonController } from '../utils/crudFactory.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/validate.js';

export function singletonRouter(Model, allowed) {
  const c = singletonController(Model, allowed);
  const router = Router();
  router.get('/', c.read);
  router.put('/', requireAuth, requireAdmin, sanitizeBody, c.write);
  return router;
}
