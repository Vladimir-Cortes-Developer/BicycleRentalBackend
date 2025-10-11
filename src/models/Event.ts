import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description?: string;
  eventType: string;
  eventDate: Date;
  startTime: string;
  endTime?: string;
  routeDescription?: string;
  meetingPoint?: string;
  meetingPointLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  maxParticipants?: number;
  currentParticipants: number;
  regionalId: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      maxlength: [200, 'Event name cannot exceed 200 characters'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    eventType: {
      type: String,
      maxlength: [50, 'Event type cannot exceed 50 characters'],
      default: 'ciclopaseo',
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
    },
    routeDescription: {
      type: String,
      trim: true,
    },
    meetingPoint: {
      type: String,
      maxlength: [255, 'Meeting point cannot exceed 255 characters'],
      trim: true,
    },
    meetingPointLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Max participants must be at least 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    regionalId: {
      type: Schema.Types.ObjectId,
      ref: 'Regional',
      required: [true, 'Regional ID is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'cancelled', 'completed'],
        message: 'Status must be draft, published, cancelled, or completed',
      },
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Índices
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ regionalId: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ meetingPointLocation: '2dsphere' });

// Validación: currentParticipants no puede exceder maxParticipants
eventSchema.pre('save', function (next) {
  if (this.maxParticipants && this.currentParticipants > this.maxParticipants) {
    next(new Error('Current participants cannot exceed max participants'));
  }
  next();
});

export const Event = model<IEvent>('Event', eventSchema);
