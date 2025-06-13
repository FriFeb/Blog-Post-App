const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const keys = require(path.join(__dirname, '../config/keys'));

const mongoUrl = process.env.MONGO_URL || keys.mongoURI;

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('comparePassword should match hash correctly', async () => {
    const plain = 'Password123';
    const hashed = await bcrypt.hash(plain, 10);
    const user = new User({ username: 'test', passwordHash: hashed });
    const isMatch = await new Promise((res, rej) => {
      user.comparePassword(plain, (err, match) => {
        if (err) return rej(err);
        res(match);
      });
    });
    expect(isMatch).toBe(true);
  });

  test('incLoginAttempts should increment count and set lockUntil', async () => {
    const plain = 'Password123';
    const hashed = await bcrypt.hash(plain, 10);
    const user = new User({
      username: 'test2',
      passwordHash: hashed,
      loginAttempts: 0,
    });
    await user.incLoginAttempts();
    const reloaded = await User.findById(user._id);
    expect(reloaded.loginAttempts).toBe(1);
  });

  test('getAuthenticated should reject nonexistent user', async () => {
    const res = await new Promise((resolve) => {
      User.getAuthenticated('not_found', 'any', (err, user, reason) =>
        resolve({ err, user, reason })
      );
    });
    expect(res.user).toBeNull();
    expect(res.reason).toBe(User.failedLogin.NOT_FOUND);
  });
});
