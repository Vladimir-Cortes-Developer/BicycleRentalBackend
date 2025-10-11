import { Schema, model, Document, Types } from 'mongoose';

export interface IEventParticipant extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  registrationDate: Date;
  attendanceStatus: 'registered' | 'attended' | 'absent' | 'cancelled';
}

const eventParticipantSchema = new Schema<IEventParticipant>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    attendanceStatus: {
      type: String,
      enum: {
        values: ['registered', 'attended', 'absent', 'cancelled'],
        message: 'Attendance status must be registered, attended, absent, or cancelled',
      },
      default: 'registered',
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto único para evitar inscripciones duplicadas
eventParticipantSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventParticipantSchema.index({ userId: 1 });

export const EventParticipant = model<IEventParticipant>(
  'EventParticipant',
  eventParticipantSchema
);
