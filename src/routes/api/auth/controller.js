const jwt = require('jsonwebtoken');

// models load
const User = require('../../../models/user');

/*
  POST /api/auth/register
  {
    username,
    password
  }
*/
exports.register = (req, res) => {
  const { username, password } = req.body;
  let newUser = null;

  const create = user => {
    if (user) {
      throw new Error("User already exists.");
    } else {
      return User.create(username, password);
    }
  };

  const count = user => {
    newUser = user;
    return User.countDocuments({}).exec();
  };

  const assign = count => {
    if (count === 1) {
      return newUser.assignAdmin();
    } else {
      return Promise.resolve(false);
    }
  };

  const respond = isAdmin => {
    res.json({
      message: "Registered successfully",
      admin: !!isAdmin,   // isAdmin ? true : false
    });
  };

  const onError = error => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

/*
  POST /api/auth/login
  {
    username,
    password
  }
 */
exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get('jwt-secret');

  const check = user => {
    if (!user) {
      throw new Error("User doesn't exist.");
    } else {
      if (user.verify(password)) {
        return new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin,
            },
            secret,
            {
              expiresIn: "7d",
              issuer: "cutelee.com",
              subject: "userInfo",
            },
            (err, token) => {
              if (err) {
                reject(err);
              }
              resolve(token);
            }
          );
        });
      } else {
        throw new Error("Login failed: Wrong password");
      }
    }
  };

  const respond = token => {
    res.json({
      message: "Logged in successfully.",
      token,
    });
  };

  const onError = error => {
    res.status(403).json({
      message: error._message,
    });
  };

  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError);
};

/*
  GET /api/auth/check
 */
exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};