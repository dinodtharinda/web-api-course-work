const { Op } = require('sequelize');
const { User } = require('@/models');
const { USER_ROLES } = require('@/models/user.model');
const { parseListQuery, buildListMeta } = require('@/utils/list-query.util');

const USER_ATTRIBUTES = ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'];

const listUsers = async (req, res, next) => {
  try {
    const query = parseListQuery(req.query, {
      defaultSortBy: 'createdAt',
      defaultSortOrder: 'DESC',
      allowedSortBy: ['firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    const where = {};

    if (query.search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${query.search}%` } },
        { lastName: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
      ];
    }

    if (req.query.role) {
      where.role = String(req.query.role).toLowerCase();
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: USER_ATTRIBUTES,
      order: [[query.sortBy, query.sortOrder]],
      limit: query.limit,
      offset: query.offset,
    });

    return res.status(200).json({
      success: true,
      message: 'Users retrieved',
      data: rows,
      meta: buildListMeta(query, count),
    });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, { attributes: USER_ATTRIBUTES });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User retrieved', data: user });
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { firstName, lastName, role, isActive } = req.body;
    const updates = {};
    const isSelf = String(req.auth.sub) === String(user.id);

    if (firstName !== undefined) {
      if (!String(firstName).trim()) {
        return res.status(422).json({ success: false, message: 'firstName must not be empty' });
      }
      updates.firstName = String(firstName).trim();
    }

    if (lastName !== undefined) {
      if (!String(lastName).trim()) {
        return res.status(422).json({ success: false, message: 'lastName must not be empty' });
      }
      updates.lastName = String(lastName).trim();
    }

    if (role !== undefined) {
      const normalizedRole = String(role).trim().toLowerCase();
      if (!USER_ROLES.includes(normalizedRole)) {
        return res.status(422).json({
          success: false,
          message: `role must be one of: ${USER_ROLES.join(', ')}`,
        });
      }
      if (isSelf && normalizedRole !== user.role) {
        return res.status(400).json({ success: false, message: 'You cannot change your own role' });
      }
      updates.role = normalizedRole;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(422).json({ success: false, message: 'isActive must be a boolean' });
      }
      if (isSelf && !isActive) {
        return res.status(400).json({ success: false, message: 'You cannot deactivate yourself' });
      }
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one of firstName, lastName, role, isActive',
      });
    }

    await user.update(updates);

    return res.status(200).json({
      success: true,
      message: 'User updated',
      data: await User.findByPk(user.id, { attributes: USER_ATTRIBUTES }),
    });
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (String(req.auth.sub) === String(user.id)) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate yourself' });
    }

    await user.update({ isActive: false });

    return res.status(200).json({ success: true, message: 'User deactivated' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};
