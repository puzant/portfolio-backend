import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    name: { type: String },
    country: { type: String },
    city: { type: String },
    phone: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    refreshToken: { type: String },
    resetPasswordToken: { type: String, index: true },
    resetPasswordExpires: { type: Date, index: true },
    passwordChangedAt: { type: Date, default: null },
    role: { type: String, enum: ['admin', 'guest'], default: 'guest' },
    cacheToggles: {
      projects: { type: Boolean, default: false },
      publications: { type: Boolean, default: false },
      travelImages: { type: Boolean, default: false },
    },
    preferences: {
      dragDropEnabled: {
        projects: { type: Boolean, default: true },
        travelImages: { type: Boolean, default: true },
      }
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

export default mongoose.model('User', UserSchema)