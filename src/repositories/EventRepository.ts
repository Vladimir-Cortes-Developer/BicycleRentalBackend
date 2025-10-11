import { injectable } from 'tsyringe';
import { Event, IEvent } from '../models/Event';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class EventRepository {
  async create(eventData: Partial<IEvent>, session?: ClientSession): Promise<IEvent> {
    const event = new Event(eventData);
    return session ? event.save({ session }) : event.save();
  }

  async findById(id: string): Promise<IEvent | null> {
    return Event.findById(id).populate('regionalId').populate('createdBy');
  }

  async findAll(filters?: FilterQuery<IEvent>): Promise<IEvent[]> {
    return Event.find(filters || {})
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findPublished(): Promise<IEvent[]> {
    return Event.find({ status: 'published', eventDate: { $gte: new Date() } })
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findByStatus(status: string): Promise<IEvent[]> {
    return Event.find({ status })
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findByRegional(regionalId: string): Promise<IEvent[]> {
    return Event.find({ regionalId })
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findUpcoming(regionalId?: string): Promise<IEvent[]> {
    const filter: FilterQuery<IEvent> = {
      status: 'published',
      eventDate: { $gte: new Date() },
    };

    if (regionalId) {
      filter.regionalId = regionalId;
    }

    return Event.find(filter)
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IEvent[]> {
    return Event.find({
      eventDate: { $gte: startDate, $lte: endDate },
    })
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async findAvailableEvents(): Promise<IEvent[]> {
    return Event.find({
      status: 'published',
      eventDate: { $gte: new Date() },
      $expr: {
        $or: [{ $eq: ['$maxParticipants', null] }, { $lt: ['$currentParticipants', '$maxParticipants'] }],
      },
    })
      .populate('regionalId')
      .populate('createdBy')
      .sort({ eventDate: 1 });
  }

  async update(
    id: string,
    data: Partial<IEvent>,
    session?: ClientSession
  ): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true, session });
  }

  async incrementParticipants(id: string, session?: ClientSession): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(
      id,
      { $inc: { currentParticipants: 1 } },
      { new: true, session }
    );
  }

  async decrementParticipants(id: string, session?: ClientSession): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(
      id,
      { $inc: { currentParticipants: -1 } },
      { new: true, session }
    );
  }

  async delete(id: string, session?: ClientSession): Promise<IEvent | null> {
    return Event.findByIdAndDelete(id, { session });
  }

  async count(filters?: FilterQuery<IEvent>): Promise<number> {
    return Event.countDocuments(filters || {});
  }

  async hasAvailableSlots(id: string): Promise<boolean> {
    const event = await Event.findById(id);
    if (!event) return false;
    if (!event.maxParticipants) return true; // Sin límite
    return event.currentParticipants < event.maxParticipants;
  }
}
