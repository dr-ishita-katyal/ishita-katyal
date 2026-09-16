import ApiError from './ApiError.js';
import { asyncHandler } from './ApiError.js';

/**
 * Builds the standard list/read/create/update/delete/reorder handlers shared by
 * every orderable content type, so each resource only has to declare its model
 * and which fields it accepts.
 */
export function crudFactory(Model, { allowed, defaultSort = { order: 1, createdAt: 1 }, onDelete } = {}) {
  const pick = (body) => {
    const out = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key];
    }
    return out;
  };

  const findOr404 = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'That item no longer exists. It may have been deleted.');
    return doc;
  };

  return {
    // Public reads only ever return visible items.
    listPublic: asyncHandler(async (req, res) => {
      const filter = { visible: true };
      if (req.query.category) filter.category = req.query.category;
      if (req.query.track) filter.track = req.query.track;
      res.json(await Model.find(filter).sort(defaultSort).lean());
    }),

    listAdmin: asyncHandler(async (req, res) => {
      const filter = {};
      if (req.query.category) filter.category = req.query.category;
      if (req.query.track) filter.track = req.query.track;
      res.json(await Model.find(filter).sort(defaultSort).lean());
    }),

    getOne: asyncHandler(async (req, res) => {
      res.json(await findOr404(req.params.id));
    }),

    create: asyncHandler(async (req, res) => {
      const payload = pick(req.body);
      if (payload.order === undefined || payload.order === null || payload.order === '') {
        const last = await Model.findOne().sort({ order: -1 }).select('order').lean();
        payload.order = last ? (last.order || 0) + 1 : 0;
      }
      const doc = await Model.create(payload);
      res.status(201).json(doc);
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await findOr404(req.params.id);
      Object.assign(doc, pick(req.body));
      await doc.save();
      res.json(doc);
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await findOr404(req.params.id);
      if (onDelete) await onDelete(doc);
      await doc.deleteOne();
      res.json({ id: req.params.id, deleted: true });
    }),

    // Accepts [{ id, order }, ...] from the drag-and-drop list.
    reorder: asyncHandler(async (req, res) => {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      if (!items.length) throw new ApiError(400, 'Send an "items" array of { id, order } pairs.');
      await Model.bulkWrite(
        items.map(({ id, order }) => ({
          updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) || 0 } } },
        }))
      );
      res.json(await Model.find().sort(defaultSort).lean());
    }),
  };
}

/** Read-or-create helper for the three singleton documents. */
export function singletonController(Model, allowed) {
  const get = async () => {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create({});
    return doc;
  };

  return {
    read: asyncHandler(async (req, res) => res.json(await get())),
    write: asyncHandler(async (req, res) => {
      const doc = await get();
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) doc[key] = req.body[key];
      }
      await doc.save();
      res.json(doc);
    }),
  };
}
