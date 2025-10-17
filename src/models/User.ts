import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  documentType: 'CC' | 'TI' | 'CE';
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  socioeconomicStratum?: number;
  role: 'user' | 'admin';
  regionalId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    documentType: {
      type: String,
      enum: {
        values: ['CC', 'TI', 'CE'],
        message: 'Document type must be CC, TI, or CE',
      },
      required: [true, 'Document type is required'],
    },
    documentNumber: {
      type: String,
      required: [true, 'Document number is required'],
      unique: true,
      maxlength: [20, 'Document number cannot exceed 20 characters'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      maxlength: [100, 'First name cannot exceed 100 characters'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      maxlength: [100, 'Last name cannot exceed 100 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      maxlength: [150, 'Email cannot exceed 150 characters'],
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      maxlength: [255, 'Password hash cannot exceed 255 characters'],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
      trim: true,
    },
    socioeconomicStratum: {
      type: Number,
      min: [1, 'Socioeconomic stratum must be between 1 and 6'],
      max: [6, 'Socioeconomic stratum must be between 1 and 6'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be user or admin',
      },
      default: 'user',
    },
    regionalId: {
      type: Schema.Types.ObjectId,
      ref: 'Regional',
      required: [true, 'Regional ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices adicionales (email y documentNumber ya tienen unique: true en el schema)
userSchema.index({ regionalId: 1 });
userSchema.index({ role: 1 });

// Virtual para nombre completo
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = model<IUser>('User', userSchema);
