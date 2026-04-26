import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ── 1. TypeScript Interface ──
export interface User extends Document {
  name: string;
  email: string;
  password?: string; // Optional bcz 'select: false' rakhenge for security
  role: 'SuperAdmin' | 'InstituteAdmin' | 'Student';
  instituteId?: mongoose.Types.ObjectId; // SuperAdmin ke paas ye nahi hoga
  batchId?: mongoose.Types.ObjectId;     // Sirf Student ke paas ye hoga
  phone?: string;
  profilePic?: string;
  emailChangeCount: number;
  isActive: boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// ── 2. Mongoose Schema ──
const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Jab bhi hum DB se user mangenge, password API me leak nahi hoga
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'InstituteAdmin', 'Student'],
      required: true,
    },
    // Multi-tenancy Links
    instituteId: {
      type: Schema.Types.ObjectId,
      ref: 'Institute',
      // Institute ID is required for everyone EXCEPT SuperAdmin
      required: function () {
        return this.role !== 'SuperAdmin';
      },
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      // Batch ID is logically for Students, admin can be empty
    },
    phone: {
      type: String,
    },
    profilePic: {
      type: String,
      default: 'default-avatar.png',
    },
    // Security tracking
    emailChangeCount: {
      type: Number,
      default: 0,
      max: [1, 'Email can only be changed once.'], // Limit set ki hai
    },
    isActive: {
      type: Boolean,
      default: true, // Agar ban karna ho toh isko false kar denge
    },
  },
  {
    timestamps: true, // Automatically createdAt aur updatedAt banayega
  }
);

// ── 3. Mongoose Hooks (Pre-save Middleware) ──
// Password save hone se pehle encrypt (hash) hoga
userSchema.pre('save', async function () {
  // Agar password modify nahi hua (like only name update hua), toh skip karo
  if (!this.isModified('password')) return;

  // Hash the password with cost of 12 (Industry standard)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// ── 4. Instance Methods ──
// Login ke waqt password check karne ke liye helper function
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // this.password DB me hash wala password hai
  return await bcrypt.compare(candidatePassword, this.password);
};

// ── 5. Export Model ──
export const User = mongoose.model<User>('User', userSchema);