import mongoose, { Document, Schema } from 'mongoose';

// ── 1. TypeScript Interface ──
export interface IInstitute extends Document {
  name: string;
  slug: string; // URL-friendly name (e.g., 'allen-career')
  adminId: mongoose.Types.ObjectId; // User model se link (Institute Admin)
  contactEmail: string;
  address?: string;
  logo?: string;
  // Subscription Logic
  subscription: {
    plan: 'Starter' | 'Pro' | 'Enterprise';
    status: 'Active' | 'Inactive' | 'Expired' | 'Suspended';
    startDate: Date;
    endDate: Date;
  };
  // Usage Limits (Hard Limits)
  limits: {
    maxStudents: number;
    maxExamsPerMonth: number;
    maxStorageGB: number; // For scanned PDFs/Images
  };
  isVerified: boolean;
  settings: {
    themeColor: string;
    allowStudentSelfSignup: boolean;
  };
}

// ── 2. Mongoose Schema ──
const instituteSchema = new Schema<IInstitute>(
  {
    name: {
      type: String,
      required: [true, 'Institute name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: 'institute-default-logo.png',
    },
    // Subscription Data
    subscription: {
      plan: {
        type: String,
        enum: ['Starter', 'Pro', 'Enterprise'], // No 'Free' plan here
        required: true,
      },
      status: {
        type: String,
        enum: ['Active', 'Inactive', 'Expired', 'Suspended'],
        default: 'Active',
      },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date, required: true },
    },
    // Strict Limits based on Plan
    limits: {
      maxStudents: { type: Number, required: true },
      maxExamsPerMonth: { type: Number, required: true },
      maxStorageGB: { type: Number, default: 5 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    settings: {
      themeColor: { type: String, default: '#0D9488' }, // Default Teal
      allowStudentSelfSignup: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// ── 3. Indexing for Performance ──
instituteSchema.index({ slug: 1 });

export const Institute = mongoose.model<IInstitute>('Institute', instituteSchema);