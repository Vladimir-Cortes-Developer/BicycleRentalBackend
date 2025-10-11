import { injectable } from 'tsyringe';
import { MaintenanceLog, IMaintenanceLog } from '../models/MaintenanceLog';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class MaintenanceLogRepository {
  async create(
    logData: Partial<IMaintenanceLog>,
    session?: ClientSession
  ): Promise<IMaintenanceLog> {
    const log = new MaintenanceLog(logData);
    return session ? log.save({ session }) : log.save();
  }

  async findById(id: string): Promise<IMaintenanceLog | null> {
    return MaintenanceLog.findById(id).populate('bicycleId');
  }

  async findAll(filters?: FilterQuery<IMaintenanceLog>): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find(filters || {})
      .populate('bicycleId')
      .sort({ maintenanceDate: -1 });
  }

  async findByBicycle(bicycleId: string): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find({ bicycleId })
      .populate('bicycleId')
      .sort({ maintenanceDate: -1 });
  }

  async findByType(maintenanceType: string): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find({ maintenanceType })
      .populate('bicycleId')
      .sort({ maintenanceDate: -1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find({
      maintenanceDate: { $gte: startDate, $lte: endDate },
    })
      .populate('bicycleId')
      .sort({ maintenanceDate: -1 });
  }

  async findUpcomingMaintenance(): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find({
      nextMaintenanceDate: { $gte: new Date() },
    })
      .populate('bicycleId')
      .sort({ nextMaintenanceDate: 1 });
  }

  async findOverdueMaintenance(): Promise<IMaintenanceLog[]> {
    return MaintenanceLog.find({
      nextMaintenanceDate: { $lt: new Date() },
    })
      .populate('bicycleId')
      .sort({ nextMaintenanceDate: 1 });
  }

  async getLastMaintenanceByBicycle(bicycleId: string): Promise<IMaintenanceLog | null> {
    return MaintenanceLog.findOne({ bicycleId }).sort({ maintenanceDate: -1 });
  }

  async update(
    id: string,
    data: Partial<IMaintenanceLog>,
    session?: ClientSession
  ): Promise<IMaintenanceLog | null> {
    return MaintenanceLog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });
  }

  async delete(id: string, session?: ClientSession): Promise<IMaintenanceLog | null> {
    return MaintenanceLog.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IMaintenanceLog>): Promise<number> {
    return MaintenanceLog.countDocuments(filters || {});
  }

  async getTotalMaintenanceCost(startDate?: Date, endDate?: Date): Promise<number> {
    const match: FilterQuery<IMaintenanceLog> = {};

    if (startDate || endDate) {
      match.maintenanceDate = {};
      if (startDate) match.maintenanceDate.$gte = startDate;
      if (endDate) match.maintenanceDate.$lte = endDate;
    }

    const result = await MaintenanceLog.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: '$cost' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }
}
