import { Schema, model, Document, Types } from 'mongoose';

export interface IRental extends Document {
  userId: Types.ObjectId;
  bicycleId: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  estimatedReturnTime?: Date;
  startLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  endLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  baseRate: number;
  hoursUsed?: number;
  subtotal?: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bicycleId: {
      type: Schema.Types.ObjectId,
      ref: 'Bicycle',
      required: [true, 'Bicycle ID is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    estimatedReturnTime: {
      type: Date,
    },
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    endLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    baseRate: {
      type: Number,
      required: [true, 'Base rate is required'],
      min: [0, 'Base rate must be a positive number'],
    },
    hoursUsed: {
      type: Number,
      min: [0, 'Hours used must be a positive number'],
    },
    subtotal: {
      type: Number,
      min: [0, 'Subtotal must be a positive number'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage must be between 0 and 1'],
      max: [1, 'Discount percentage must be between 0 and 1'],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount must be a positive number'],
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount must be a positive number'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'cancelled'],
        message: 'Payment status must be pending, paid, or cancelled',
      },
      default: 'pending',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'cancelled'],
        message: 'Status must be active, completed, or cancelled',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Índices
rentalSchema.index({ userId: 1 });
rentalSchema.index({ bicycleId: 1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ startTime: 1, endTime: 1 });
rentalSchema.index({ paymentStatus: 1 });
rentalSchema.index({ startLocation: '2dsphere' });
rentalSchema.index({ endLocation: '2dsphere' });

export const Rental = model<IRental>('Rental', rentalSchema);
