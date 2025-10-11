import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  rentalId: Types.ObjectId;
  amount: number;
  paymentMethod?: string;
  paymentDate: Date;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

const paymentSchema = new Schema<IPayment>(
  {
    rentalId: {
      type: Schema.Types.ObjectId,
      ref: 'Rental',
      required: [true, 'Rental ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    paymentMethod: {
      type: String,
      maxlength: [50, 'Payment method cannot exceed 50 characters'],
      trim: true,
      enum: {
        values: ['cash', 'card', 'transfer', 'other'],
        message: 'Payment method must be cash, card, transfer, or other',
      },
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
      maxlength: [100, 'Transaction ID cannot exceed 100 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded'],
        message: 'Status must be pending, completed, failed, or refunded',
      },
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Índices
paymentSchema.index({ rentalId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ transactionId: 1 });

export const Payment = model<IPayment>('Payment', paymentSchema);
