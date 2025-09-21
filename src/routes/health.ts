import { Request, Response, Router } from 'express';
const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    connected: true,
    status: 'Success',
  });
});

export default router;