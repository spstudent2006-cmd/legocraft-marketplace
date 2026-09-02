import crypto from "crypto";
import { DB } from "./db.mjs";

const SESSION_COOKIE = "lc_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(userId) {
  const db = DB.read();
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions[token] = { userId, expires: Date.now() + SESSION_TTL_MS };
  DB.write(db);
  return token;
}

export function destroySession(token) {
  const db = DB.read();
  delete db.sessions[token];
  DB.write(db);
}

export function getUserFromRequest(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  const db = DB.read();
  const session = db.sessions[token];
  if (!session || session.expires < Date.now()) return null;
  const user = db.users.find(u => u.id === session.userId);
  if (!user || user.status === "banned") return null;
  const { salt, hash, ...safe } = user;
  return safe;
}

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_TTL_MS
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE);
}

export function requireAuth(roles = null) {
  return (req, res, next) => {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Please log in to continue." });
    if (roles && !roles.includes(user.role)) {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }
    req.user = user;
    next();
  };
}

export { SESSION_COOKIE };
