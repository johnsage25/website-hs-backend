const jose = require("jose");
const signJwt = async (payload, secret, expire = "1d") => {
  const key = Buffer.from(secret, "hex");
  return (
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      // subject
      .setSubject("auth")
      .setIssuedAt()
      // set this per component
      .setIssuer("https://hostspacing.com")
      // set this per usage
      .setAudience("https://hostspacing.com/support")
      // change it
      .setExpirationTime(expire)
      .sign(key)
  );
};

const verifyJwt = async (jwt, secret) => {
  const key = Buffer.from(secret, "hex");
  return await jose.jwtVerify(jwt, key, {
    issuer: "https://hostspacing.com",
    audience: "https://hostspacing.com/support",
    algorithms: ["HS256"],
  });
};

export { signJwt, verifyJwt };
