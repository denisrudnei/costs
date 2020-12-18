import { Router } from 'express';

import { ExportService } from '../services/ExportService';
import { getUser } from '../util';

const router = Router();

router.use('/export', async (req, res) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(403).json({
      message: 'User not found',
    });
  }

  const {
    start, finish, separator, type,
  } = req.body;
  return ExportService.exportInfo(start, finish, type, separator, user.id).then((data) => {
    res.header('Content-Type', 'application/text');
    res.header('Content-Disposition', 'attachment; filename=export.txt');
    res.send(data);
    res.end();
  });
});

export default router;
