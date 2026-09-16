import { Router } from 'express';
import { crudFactory } from '../utils/crudFactory.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/validate.js';

/**
 * Mounts the identical route shape for each orderable content type:
 *   GET    /            public, visible items only
 *   GET    /all         admin, everything
 *   POST   /            admin
 *   PATCH  /reorder     admin
 *   GET    /:id         admin
 *   PATCH  /:id         admin
 *   DELETE /:id         admin
 */
export function resourceRouter(Model, options) {
  const c = crudFactory(Model, options);
  const router = Router();
  const guard = [requireAuth, requireAdmin];

  router.get('/', c.listPublic);
  router.get('/all', guard, c.listAdmin);
  router.post('/', guard, sanitizeBody, c.create);
  router.patch('/reorder', guard, c.reorder);
  router.get('/:id', guard, c.getOne);
  router.patch('/:id', guard, sanitizeBody, c.update);
  router.delete('/:id', guard, c.remove);

  return router;
}
