const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.cookies?.jwt; // pega do cookie

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Token ausente." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }

    req.user = decoded; // { id, email }
    next();
  });
}

module.exports = authenticateJWT;
