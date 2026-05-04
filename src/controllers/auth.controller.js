const bcrypt = require('bcryptjs');

const { User } = require('@/models');
const { USER_ROLES } = require('@/models/user.model');
const { authConfig } = require('@/configs/constants.config');
const { generateAccessToken } = require('@/utils/token.util');

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'firstName, lastName, email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = role ? String(role).trim().toLowerCase() : 'viewer';

    if (!USER_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: `role must be one of: ${USER_ROLES.join(', ')}`,
      });
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const createdUser = await User.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered',
      data: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isPasswordValid || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: authConfig.jwtAccessExpiresIn,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.auth.sub, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Current user profile',
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.auth.sub);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: authConfig.jwtAccessExpiresIn,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Tokens are stateless JWTs; the client discards the token.
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword and newPassword are required',
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(422).json({
        success: false,
        message: 'newPassword must be at least 8 characters',
      });
    }

    const user = await User.findByPk(req.auth.sub);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(String(currentPassword), user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    await user.update({ passwordHash: await bcrypt.hash(String(newPassword), 10) });

    return res.status(200).json({
      success: true,
      message: 'Password changed',
    });
  } catch (err) {
    return next(err);
  }
};

const adminGuardCheck = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin access granted',
  });
};

module.exports = {
  register,
  login,
  me,
  refreshToken,
  logout,
  changePassword,
  adminGuardCheck,
};
