import { Schema, model, Document, Types } from 'mongoose';

export interface IMaintenanceLog extends Document {
  bicycleId: Types.ObjectId;
  maintenanceType: string;
  description?: string;
  cost?: number;
  performedBy?: string;
  maintenanceDate: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
}

const maintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    bicycleId: {
      type: Schema.Types.ObjectId,
      ref: 'Bicycle',
      required: [true, 'Bicycle ID is required'],
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      maxlength: [100, 'Maintenance type cannot exceed 100 characters'],
      trim: true,
      enum: {
        values: ['preventive', 'corrective', 'inspection', 'repair', 'other'],
        message: 'Maintenance type must be preventive, corrective, inspection, repair, or other',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      min: [0, 'Cost must be a positive number'],
    },
    performedBy: {
      type: String,
      maxlength: [150, 'Performed by cannot exceed 150 characters'],
      trim: true,
    },
    maintenanceDate: {
      type: Date,
      required: [true, 'Maintenance date is required'],
      default: Date.now,
    },
    nextMaintenanceDate: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Índices
maintenanceLogSchema.index({ bicycleId: 1 });
maintenanceLogSchema.index({ maintenanceDate: 1 });
maintenanceLogSchema.index({ nextMaintenanceDate: 1 });

export const MaintenanceLog = model<IMaintenanceLog>('MaintenanceLog', maintenanceLogSchema);
