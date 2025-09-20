import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "snipesendmailer";
const encodedSecret = new TextEncoder().encode(secretKey);

// Encrypt session payload into a JWT
export async function encrypt(sessionPayload) {
  return await new SignJWT(sessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr") // Token valid for 2 minutes
    .sign(encodedSecret);
}

// Decrypt and verify the session JWT
export async function decrypt(token) {
  try {
    if (!token || typeof token !== "string") {
      console.log("Session token is missing or invalid type.");
      return;
    }

    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (err) {
    console.log("Invalid session token:", err);
    return null;
  }
}

// Create a session token from a user ID and store in cookie
export async function createSession(customer_id, customer_email ) {
  const expiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hr in ms
  const sessionToken = await encrypt({ customer_id,customer_email, expiresAt });
  return sessionToken;
}

// Destroy session
export function destroySession() {
  cookies().set("session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });
}
