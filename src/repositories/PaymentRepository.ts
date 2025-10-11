import { injectable } from 'tsyringe';
import { Payment, IPayment } from '../models/Payment';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class PaymentRepository {
  async create(paymentData: Partial<IPayment>, session?: ClientSession): Promise<IPayment> {
    const payment = new Payment(paymentData);
    return session ? payment.save({ session }) : payment.save();
  }

  async findById(id: string): Promise<IPayment | null> {
    return Payment.findById(id).populate('rentalId');
  }

  async findByRental(rentalId: string): Promise<IPayment | null> {
    return Payment.findOne({ rentalId }).populate('rentalId');
  }

  async findByTransactionId(transactionId: string): Promise<IPayment | null> {
    return Payment.findOne({ transactionId });
  }

  async findAll(filters?: FilterQuery<IPayment>): Promise<IPayment[]> {
    return Payment.find(filters || {}).populate('rentalId').sort({ paymentDate: -1 });
  }

  async findByStatus(status: string): Promise<IPayment[]> {
    return Payment.find({ status }).populate('rentalId').sort({ paymentDate: -1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IPayment[]> {
    return Payment.find({
      paymentDate: { $gte: startDate, $lte: endDate },
    })
      .populate('rentalId')
      .sort({ paymentDate: -1 });
  }

  async update(
    id: string,
    data: Partial<IPayment>,
    session?: ClientSession
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    session?: ClientSession
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(id, { status }, { new: true, session });
  }

  async delete(id: string, session?: ClientSession): Promise<IPayment | null> {
    return Payment.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IPayment>): Promise<number> {
    return Payment.countDocuments(filters || {});
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const match: FilterQuery<IPayment> = { status: 'completed' };

    if (startDate || endDate) {
      match.paymentDate = {};
      if (startDate) match.paymentDate.$gte = startDate;
      if (endDate) match.paymentDate.$lte = endDate;
    }

    const result = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }
}
