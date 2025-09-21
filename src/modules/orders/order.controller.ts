import { NextFunction, Response } from 'express';
import orderService from './order.service';
import { CrudController } from '@src/core/helpers';
import { IOrder } from './order.model';
import { HttpException } from '@src/core/exceptions';
import { constant } from '@src/core/configurations/constants';
import { DateTime } from 'luxon';
import { pdfService } from '@src/core/pdf/pdf.service';

class OrderController extends CrudController<IOrder> {

  constructor() {
    super(orderService, 'order-controller');
  }
  public changeStatus = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      await orderService.changeStatus(req.body, req.user?.id);
      res.json({success: true})
    } catch (error) {
      next(error);
    }
  }
  public resumeOrder = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await orderService.resumeOrder(req.params.id);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
  public byClient = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await orderService.byClient(req.params.clientId, req.query);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
  public create = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      if(!req.user) {
        throw new HttpException('Debe crear un usuario para poder comprar', 401);
      }
      const orders = await orderService.create(req.body, req.user);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
  public generateOrder = async (req: any, res: Response, next: any) => {
    try {
      
      const html = await orderService.generatePDF(req.params.id);
      const date = DateTime.now().toFormat(constant.date.formatPdfName, {locale: 'es'});
      const fileName = `Pedido-${req.params.id}-${date}.pdf`;
      
      await pdfService.generateAndSave(html, fileName);
      pdfService.toResponse(res, fileName);
    } catch (error) {
      next(error);
    }
  };

  public allPaid = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await orderService.allPaid(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

  public markAsPaid = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      const paidStatus = await orderService.getPaidStatus();
      if (!paidStatus) throw new Error('Estado "paid" no encontrado');
      await orderService.changeStatus({ id: orderId, statusId: paidStatus.id }, req.user?.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();