import { injectable } from 'tsyringe';
import { Regional, IRegional } from '../models/Regional';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class RegionalRepository {
  async create(regionalData: Partial<IRegional>, session?: ClientSession): Promise<IRegional> {
    const regional = new Regional(regionalData);
    return session ? regional.save({ session }) : regional.save();
  }

  async findById(id: string): Promise<IRegional | null> {
    return Regional.findById(id);
  }

  async findAll(filters?: FilterQuery<IRegional>): Promise<IRegional[]> {
    return Regional.find(filters || {}).sort({ name: 1 });
  }

  async findByName(name: string): Promise<IRegional | null> {
    return Regional.findOne({ name: new RegExp(name, 'i') });
  }

  async findByCity(city: string): Promise<IRegional[]> {
    return Regional.find({ city: new RegExp(city, 'i') }).sort({ name: 1 });
  }

  async findByDepartment(department: string): Promise<IRegional[]> {
    return Regional.find({ department: new RegExp(department, 'i') }).sort({ name: 1 });
  }

  /**
   * Encuentra regionales cercanas a una ubicación
   * @param longitude Longitud
   * @param latitude Latitud
   * @param maxDistance Distancia máxima en metros (default 50000m = 50km)
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 50000
  ): Promise<IRegional[]> {
    return Regional.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });
  }

  async update(
    id: string,
    data: Partial<IRegional>,
    session?: ClientSession
  ): Promise<IRegional | null> {
    return Regional.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async delete(id: string, session?: ClientSession): Promise<IRegional | null> {
    return Regional.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IRegional>): Promise<number> {
    return Regional.countDocuments(filters || {});
  }
}
