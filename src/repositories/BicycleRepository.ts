import { injectable } from 'tsyringe';
import { Bicycle, IBicycle } from '../models/Bicycle';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class BicycleRepository {

    async create(bicycleData: Partial<IBicycle>, session?: ClientSession): Promise<IBicycle> {
    const bicycle = new Bicycle(bicycleData);
    return session ? bicycle.save({ session }) : bicycle.save();
  }

  async findById(id: string): Promise<IBicycle | null> {
    return Bicycle.findById(id).populate('regionalId');
  }

  async findByCode(code: string): Promise<IBicycle | null> {
    return Bicycle.findOne({ code: code.toUpperCase() }).populate('regionalId');
  }

  async findAll(filters?: FilterQuery<IBicycle>): Promise<IBicycle[]> {
    return Bicycle.find(filters || {}).populate('regionalId').sort({ code: 1 });
  }

  async findAvailable(regionalId?: string): Promise<IBicycle[]> {
    const filter: FilterQuery<IBicycle> = { status: 'available' };
    if (regionalId) {
      filter.regionalId = regionalId;
    }
    return Bicycle.find(filter).populate('regionalId');
  }

  async findByStatus(status: string, regionalId?: string): Promise<IBicycle[]> {
    const filter: FilterQuery<IBicycle> = { status };
    if (regionalId) {
      filter.regionalId = regionalId;
    }
    return Bicycle.find(filter).populate('regionalId');
  }

  async findByRegional(regionalId: string): Promise<IBicycle[]> {
    return Bicycle.find({ regionalId }).populate('regionalId');
  }

  /**
   * Encuentra bicicletas cercanas a una ubicación
   * @param longitude Longitud
   * @param latitude Latitud
   * @param maxDistance Distancia máxima en metros (default 5000m = 5km)
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 5000
  ): Promise<IBicycle[]> {
    return Bicycle.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    }).populate('regionalId');
  }

  async update(
    id: string,
    data: Partial<IBicycle>,
    session?: ClientSession
  ): Promise<IBicycle | null> {
    return Bicycle.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async updateStatus(
    id: string,
    status: 'available' | 'rented' | 'maintenance' | 'retired',
    session?: ClientSession
  ): Promise<IBicycle | null> {
    return Bicycle.findByIdAndUpdate(id, { status }, { new: true, session });
  }

  async updateLocation(
    id: string,
    longitude: number,
    latitude: number,
    session?: ClientSession
  ): Promise<IBicycle | null> {
    return Bicycle.findByIdAndUpdate(
      id,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true, session }
    );
  }

  async delete(id: string, session?: ClientSession): Promise<IBicycle | null> {
    return Bicycle.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IBicycle>): Promise<number> {
    return Bicycle.countDocuments(filters || {});
  }

  async countByStatus(): Promise<{ status: string; count: number }[]> {
    return Bicycle.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);
  }
}
