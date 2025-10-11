import { Schema, model, Document, Types } from 'mongoose';

export interface IBicycle extends Document {
  code: string;
  brand: string;
  bicycleModel?: string;
  color: string;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  rentalPricePerHour: number;
  regionalId: Types.ObjectId;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  purchaseDate?: Date;
  lastMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bicycleSchema = new Schema<IBicycle>(
  {
    code: {
      type: String,
      required: [true, 'Bicycle code is required'],
      unique: true,
      maxlength: [50, 'Code cannot exceed 50 characters'],
      trim: true,
      uppercase: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      maxlength: [100, 'Brand cannot exceed 100 characters'],
      trim: true,
    },
    bicycleModel: {
      type: String,
      maxlength: [100, 'Model cannot exceed 100 characters'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      maxlength: [50, 'Color cannot exceed 50 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'rented', 'maintenance', 'retired'],
        message: 'Status must be available, rented, maintenance, or retired',
      },
      default: 'available',
    },
    rentalPricePerHour: {
      type: Number,
      required: [true, 'Rental price per hour is required'],
      min: [0, 'Rental price must be a positive number'],
    },
    regionalId: {
      type: Schema.Types.ObjectId,
      ref: 'Regional',
      required: [true, 'Regional ID is required'],
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coords: number[]) => coords.length === 2,
          message: 'Location coordinates must be [longitude, latitude]',
        },
      },
    },
    purchaseDate: {
      type: Date,
    },
    lastMaintenanceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
bicycleSchema.index({ code: 1 }, { unique: true });
bicycleSchema.index({ status: 1 });
bicycleSchema.index({ regionalId: 1 });
bicycleSchema.index({ currentLocation: '2dsphere' });

export const Bicycle = model<IBicycle>('Bicycle', bicycleSchema);
