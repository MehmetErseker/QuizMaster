const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

const userSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      index: true,
    },
    providerId: { type: String, index: true, sparse: true },

    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,                        
      required() {
        return this.provider === 'local';
      },
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required() {
        return this.provider === 'local';
      },
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid e-mail'],
    },
    name:   String,
    avatar: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.provider !== 'local') return next();
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  if (this.provider !== 'local')
    throw new Error('Password comparison not supported');
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.authenticate = function (username, password, cb) {
  this.findOne({ username })
    .select('+password')
    .then(async (user) => {
      if (!user) return cb(new Error('User not found'));
      const ok = await user.comparePassword(password);
      if (!ok) return cb(new Error('Invalid password'));
      cb(null, user);
    })
    .catch(cb);
};


userSchema.statics.findOrCreateGoogle = async function (payload) {
  const { sub: providerId, email, name, picture } = payload;

  let user = await this.findOne({
    $or: [{ providerId }, { email }],
  });

  if (user) {
    if (!user.providerId) user.providerId = providerId;
    if (picture && !user.avatar) user.avatar = picture;
    if (name && !user.name)      user.name   = name;
    await user.save();
    return user;
  }

  const base = email.split('@')[0].toLowerCase();
  let username = base;
  let counter  = 0;
  while (await this.exists({ username })) {
    counter += 1;
    username = `${base}-${counter}`;
  }

  user = await this.create({
    provider: 'google',
    providerId,
    username,          
    email,
    name,
    avatar: picture,
  });

  return user;
};

module.exports = mongoose.model('User', userSchema);
