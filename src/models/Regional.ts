import { Schema, model, Document } from 'mongoose';

export interface IRegional extends Document {
  name: string;
  city: string;
  department: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
}

const regionalSchema = new Schema<IRegional>(
  {
    name: {
      type: String,
      required: [true, 'Regional name is required'],
      maxlength: [150, 'Regional name cannot exceed 150 characters'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      maxlength: [100, 'City name cannot exceed 100 characters'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      maxlength: [100, 'Department name cannot exceed 100 characters'],
      trim: true,
    },
    address: {
      type: String,
      maxlength: [255, 'Address cannot exceed 255 characters'],
      trim: true,
    },
    location: {
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Índice geoespacial para búsquedas por ubicación
regionalSchema.index({ location: '2dsphere' });

export const Regional = model<IRegional>('Regional', regionalSchema);
