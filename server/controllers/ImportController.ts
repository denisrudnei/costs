import { Router } from 'express';

import { ImportService } from '../services/ImportService';
import { getUser } from '../util';

const router = Router();

router.use('/import', async (req, res) => {
  const user = await getUser(req);

  const { separator, format, merge } = req.body;

  if (!user) {
    return res.status(403).json({
      message: 'User not found',
    });
  }

  return ImportService.save(req.files!.file, user, format, separator, merge)
    .then(() => res.status(200).json({
      message: 'Success',
    }))
    .catch((e) => res.status(500).json({
      message: e.message,
    }));
});

export default router;
