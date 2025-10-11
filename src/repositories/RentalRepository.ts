import { injectable } from 'tsyringe';
import { Rental, IRental } from '../models/Rental';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class RentalRepository {
  async create(rentalData: Partial<IRental>, session?: ClientSession): Promise<IRental> {
    const rental = new Rental(rentalData);
    return session ? rental.save({ session }) : rental.save();
  }

  async findById(id: string): Promise<IRental | null> {
    return Rental.findById(id).populate('userId').populate('bicycleId');
  }

  async findAll(filters?: FilterQuery<IRental>): Promise<IRental[]> {
    return Rental.find(filters || {})
      .populate('userId')
      .populate('bicycleId')
      .sort({ startTime: -1 });
  }

  async findActiveByUser(userId: string): Promise<IRental | null> {
    return Rental.findOne({ userId, status: 'active' }).populate('bicycleId');
  }

  async findActiveByBicycle(bicycleId: string): Promise<IRental | null> {
    return Rental.findOne({ bicycleId, status: 'active' }).populate('userId');
  }

  async findByUser(userId: string): Promise<IRental[]> {
    return Rental.find({ userId }).populate('bicycleId').sort({ startTime: -1 });
  }

  async findByBicycle(bicycleId: string): Promise<IRental[]> {
    return Rental.find({ bicycleId }).populate('userId').sort({ startTime: -1 });
  }

  async findByStatus(status: string): Promise<IRental[]> {
    return Rental.find({ status }).populate('userId').populate('bicycleId').sort({ startTime: -1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IRental[]> {
    return Rental.find({
      startTime: { $gte: startDate, $lte: endDate },
    })
      .populate('userId')
      .populate('bicycleId')
      .sort({ startTime: -1 });
  }

  async update(
    id: string,
    data: Partial<IRental>,
    session?: ClientSession
  ): Promise<IRental | null> {
    return Rental.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async delete(id: string, session?: ClientSession): Promise<IRental | null> {
    return Rental.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IRental>): Promise<number> {
    return Rental.countDocuments(filters || {});
  }

  /**
   * Calcula ganancias netas por período
   */
  async aggregateRevenue(startDate: Date, endDate: Date): Promise<{
    totalRevenue: number;
    totalRentals: number;
    averageRevenue: number;
  }> {
    const result = await Rental.aggregate([
      {
        $match: {
          status: 'completed',
          endTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalRentals: { $sum: 1 },
          averageRevenue: { $avg: '$totalAmount' },
        },
      },
    ]);

    return result[0] || { totalRevenue: 0, totalRentals: 0, averageRevenue: 0 };
  }

  /**
   * Agrega ingresos por regional
   */
  async aggregateByRegional(
    startDate: Date,
    endDate: Date
  ): Promise<{ regionalId: string; totalRevenue: number; totalRentals: number }[]> {
    return Rental.aggregate([
      {
        $match: {
          status: 'completed',
          endTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: 'bicycles',
          localField: 'bicycleId',
          foreignField: '_id',
          as: 'bicycle',
        },
      },
      {
        $unwind: '$bicycle',
      },
      {
        $group: {
          _id: '$bicycle.regionalId',
          totalRevenue: { $sum: '$totalAmount' },
          totalRentals: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          regionalId: '$_id',
          totalRevenue: 1,
          totalRentals: 1,
        },
      },
    ]);
  }

  /**
   * Encuentra las bicicletas más rentables
   */
  async findMostRentableBicycles(limit: number = 10): Promise<{
    bicycleId: string;
    totalRevenue: number;
    totalRentals: number;
  }[]> {
    return Rental.aggregate([
      {
        $match: {
          status: 'completed',
        },
      },
      {
        $group: {
          _id: '$bicycleId',
          totalRevenue: { $sum: '$totalAmount' },
          totalRentals: { $sum: 1 },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          bicycleId: '$_id',
          totalRevenue: 1,
          totalRentals: 1,
        },
      },
    ]);
  }
}
