const jwt  = require('jsonwebtoken');
const User = require('../models/userModel');

const setJwtCookie = (res, userId) => {
  const token = jwt.sign({ uid: userId }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   2 * 60 * 60 * 1000,
  });
};

exports.create = async (req, res, next) => {
  try {
    const newUser   = new User(req.body);   
    const savedUser = await newUser.save();

    req.session.regenerate((regenErr) => {
      if (regenErr) return next(regenErr);

      req.session.userId = savedUser._id;
      setJwtCookie(res,   savedUser._id);  

      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);

        const userToReturn = savedUser.toObject();
        delete userToReturn.password;
        res.status(201).json(userToReturn);
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.login = function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, function (err, user) {
    if (err || !user) {
      const error = new Error('Wrong username or password');
      error.status = 401;
      return next(error);
    }

    req.session.regenerate((regenErr) => {
      if (regenErr) return next(regenErr);

      req.session.userId = user._id;
      setJwtCookie(res,   user._id);    

      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);

        const userToReturn = user.toObject();
        delete userToReturn.password;
        res.json(userToReturn);
      });
    });
  });
};


exports.profile = function (req, res, next) {
  const id = req.session.userId || req.user?.uid; 
  User.findById(id)
    .select('-password')
    .exec((error, user) => {
      if (error) return next(error);
      if (!user) {
        const err = new Error('Not authorized, go back!');
        err.status = 403;
        return next(err);
      }
      res.json(user);
    });
};

exports.findAll = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.password) delete req.body.password;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });
};
