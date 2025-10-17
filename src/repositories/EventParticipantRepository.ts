import { injectable } from 'tsyringe';
import { EventParticipant, IEventParticipant } from '../models/EventParticipant';
import { ClientSession, FilterQuery } from 'mongoose';

@injectable()
export class EventParticipantRepository {
  async create(
    participantData: Partial<IEventParticipant>,
    session?: ClientSession
  ): Promise<IEventParticipant> {
    const participant = new EventParticipant(participantData);
    return session ? participant.save({ session }) : participant.save();
  }

  async findById(id: string): Promise<IEventParticipant | null> {
    return EventParticipant.findById(id).populate('eventId').populate('userId');
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<IEventParticipant | null> {
    return EventParticipant.findOne({ eventId, userId }).populate('eventId').populate('userId');
  }

  async findByEvent(eventId: string): Promise<IEventParticipant[]> {
    return EventParticipant.find({ eventId }).populate('userId').sort({ registrationDate: 1 });
  }

  async findByUser(userId: string, eventStatus?: string): Promise<IEventParticipant[]> {
    const query = EventParticipant.find({ userId });

    // Populate eventId to access event status
    const participants = await query.populate('eventId').sort({ registrationDate: -1 });

    // Filter by event status if provided
    if (eventStatus) {
      return participants.filter(
        (participant) =>
          participant.eventId &&
          typeof participant.eventId === 'object' &&
          'status' in participant.eventId &&
          participant.eventId.status === eventStatus
      );
    }

    return participants;
  }

  async findAll(filters?: FilterQuery<IEventParticipant>): Promise<IEventParticipant[]> {
    return EventParticipant.find(filters || {})
      .populate('eventId')
      .populate('userId')
      .sort({ registrationDate: -1 });
  }

  async update(
    id: string,
    data: Partial<IEventParticipant>,
    session?: ClientSession
  ): Promise<IEventParticipant | null> {
    return EventParticipant.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });
  }

  async updateAttendanceStatus(
    eventId: string,
    userId: string,
    status: 'registered' | 'attended' | 'absent' | 'cancelled'
  ): Promise<IEventParticipant | null> {
    return EventParticipant.findOneAndUpdate(
      { eventId, userId },
      { attendanceStatus: status },
      { new: true }
    );
  }

  async delete(id: string, session?: ClientSession): Promise<IEventParticipant | null> {
    return EventParticipant.findByIdAndDelete(id, { session });
  }

  async deleteByEventAndUser(
    eventId: string,
    userId: string,
    session?: ClientSession
  ): Promise<IEventParticipant | null> {
    return EventParticipant.findOneAndDelete({ eventId, userId }, { session });
  }

  async count(filters?: FilterQuery<IEventParticipant>): Promise<number> {
    return EventParticipant.countDocuments(filters || {});
  }

  async countByEvent(eventId: string): Promise<number> {
    return EventParticipant.countDocuments({ eventId });
  }

  async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    const count = await EventParticipant.countDocuments({ eventId, userId }).limit(1);
    return count > 0;
  }
}
