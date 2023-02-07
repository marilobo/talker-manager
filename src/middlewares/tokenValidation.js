const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  const sixteen = 16;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== sixteen || typeof authorization !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  return next();
};

module.exports = tokenValidation;