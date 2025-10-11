import { injectable } from 'tsyringe';
import { User, IUser } from '../models/User';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class UserRepository {
  async create(userData: Partial<IUser>, session?: ClientSession): Promise<IUser> {
    const user = new User(userData);
    return session ? user.save({ session }) : user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).populate('regionalId');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).populate('regionalId');
  }

  async findByDocument(documentNumber: string): Promise<IUser | null> {
    return User.findOne({ documentNumber }).populate('regionalId');
  }

  async findAll(filters?: FilterQuery<IUser>): Promise<IUser[]> {
    return User.find(filters || {}).populate('regionalId').sort({ createdAt: -1 });
  }

  async findByRegional(regionalId: string): Promise<IUser[]> {
    return User.find({ regionalId }).populate('regionalId');
  }

  async update(
    id: string,
    data: Partial<IUser>,
    session?: ClientSession
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async delete(id: string, session?: ClientSession): Promise<IUser | null> {
    return User.findByIdAndDelete(id, { session });
  }

  async softDelete(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async count(filters?: FilterQuery<IUser>): Promise<number> {
    return User.countDocuments(filters || {});
  }

  async exists(filters: FilterQuery<IUser>): Promise<boolean> {
    const count = await User.countDocuments(filters).limit(1);
    return count > 0;
  }
}
