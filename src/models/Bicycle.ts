import mongoose, { Schema, model, Document, Types } from 'mongoose';

// Base interface sin Document para evitar conflicto con el método model()
interface IBicycleBase {
  code: string;
  brand: string;
  model?: string;
  color: string;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  rentalPricePerHour: mongoose.Types.Decimal128 | number;
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

// Interfaz exportada que extiende Document
export interface IBicycle extends Omit<Document, 'model'>, IBicycleBase {}

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
    model: {
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
      type: Schema.Types.Decimal128,
      required: [true, 'Rental price per hour is required'],
      get: (v: mongoose.Types.Decimal128) => v ? parseFloat(v.toString()) : 0,
    },



    regionalId: {
      type: Schema.Types.ObjectId,
      ref: 'Regional',
      required: [true, 'Regional ID is required'],
    },
    currentLocation: {
      type: new Schema(
        {
          type: {
            type: String,
            enum: ['Point'],
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
            validate: {
              validator: function(v: number[]) {
                return v.length === 2;
              },
              message: 'Coordinates must have exactly 2 elements [longitude, latitude]'
            }
          },
        },
        { _id: false }
      ),
      required: false,
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
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Índices
bicycleSchema.index({ code: 1 }, { unique: true });
bicycleSchema.index({ status: 1 });
bicycleSchema.index({ regionalId: 1 });
bicycleSchema.index({ currentLocation: '2dsphere' });

export const Bicycle = model<IBicycle>('Bicycle', bicycleSchema);
