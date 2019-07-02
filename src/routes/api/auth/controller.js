// models load
const User = require('../../../models/user');

/*
  POST /api/auth/register
  {
    username,
    password
  }
*/
exports.register = async (ctx, next) => {
  const { username, password } = ctx.request.body;

  const existUser = await User.findOneByUsername(username);
  if (existUser) {
    ctx.throw(409, "User already exists.");
  }

  const result = await User.create(username, password);
  ctx.body = {
    message: "Register Successfully!",
    isAdmin: result.admin,
  }
};


/*
  POST /api/auth/login
  {
    username,
    password
  }
 */
exports.login = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOneByUsername(username);

  if (!user) {
    ctx.throw(404, "User doesn't exist.");
  }
  if (!user.verify(password)) {
    ctx.throw(403, "Login failed: Wrong password.");
  }

  ctx.body = {
    message: "Login Success."
  };
};
