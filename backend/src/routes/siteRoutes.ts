import { Router } from 'express';
import SiteContent from '../models/SiteContent';
import { validateFirebaseToken } from '../middleware/validateFirebaseToken';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const pages = await SiteContent.find().sort({ page: 1 });
    res.json(pages);
  } catch {
    res.status(500).json({ message: 'Failed to fetch pages' });
  }
});

router.get('/:page', async (req, res) => {
  try {
    const content = await SiteContent.findOne({ page: req.params.page });
    if (!content) {
      return res.json({ page: req.params.page, title: '', subtitle: '', body: '', sections: [], meta: {} });
    }
    res.json(content);
  } catch {
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

router.put('/:page', validateFirebaseToken, adminGuard, async (req, res) => {
  try {
    const content = await SiteContent.findOneAndUpdate(
      { page: req.params.page },
      { $set: { title: req.body.title, subtitle: req.body.subtitle, body: req.body.body, sections: req.body.sections, meta: req.body.meta } },
      { upsert: true, new: true }
    );
    res.json(content);
  } catch {
    res.status(500).json({ message: 'Failed to save content' });
  }
});

router.delete('/:page', validateFirebaseToken, adminGuard, async (req, res) => {
  try {
    await SiteContent.findOneAndDelete({ page: req.params.page });
    res.json({ message: 'Page deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete page' });
  }
});

export default router;
