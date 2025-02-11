// libraries/webauthn.ts

"use server";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";
import {
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { origin, rpId } from "./constants";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { UserDevice } from "./definitions";

type User = {
  email: string;
  devices: UserDevice[];
};

type SessionData = {
  currentChallenge: string;
  email: string;
  data: object;
};

export const findUser = async (email: string): Promise<User | null> => {
  try {
    const { rows } = await sql<User>`
      SELECT * FROM users WHERE email=${email}
    `;
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};

export const createUser = async (
  email: string,
  devices: UserDevice[]
): Promise<User> => {
  const user = await findUser(email);

  if (user) {
    throw new Error("User already exists");
  }

  try {
    await sql`
      INSERT INTO users (name, email, devices, role, password)
      VALUES (${email}, ${email}, ${JSON.stringify(
      devices
    )}, ${"user"}, ${"password"})
    `;
    return { email, devices };
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user.");
  }
};

export const getSession = async (id: string): Promise<SessionData | null> => {
  try {
    const { rows } = await sql<SessionData>`
      SELECT * FROM sessions WHERE id = ${id}
    `;
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    throw new Error("Failed to fetch session.");
  }
};

export const createSession = async (id: string, data: SessionData) => {
  try {
    await sql`
      INSERT INTO sessions (id, data)
      VALUES (${id}, ${JSON.stringify(data)})
      ON CONFLICT (id) DO UPDATE
      SET data = ${JSON.stringify(data)}
    `;
    console.log(`Session created/updated successfully: ${id}`);
  } catch (error) {
    console.error("Failed to create/update session:", error);
    throw new Error("Failed to create/update session.");
  }
};

export const getCurrentSession = async (): Promise<{
  sessionId: string;
  data: SessionData;
}> => {
  const cookieStore = cookies();
  const sessionIdCookie = (await cookieStore).get("session_id");

  if (sessionIdCookie?.value) {
    const sessionId = sessionIdCookie.value;
    const session = await getSession(sessionId);

    if (session) {
      console.log(`Session found: ${sessionId}`);
      return { sessionId, data: session };
    } else {
      console.warn(`No session found for ID: ${sessionId}`);
    }
  } else {
    console.warn("No session ID found in cookies");
  }

  const newSessionId = Math.random().toString(36).slice(2);
  const newSession: SessionData = {
    currentChallenge: "",
    email: "",
    data: undefined,
  };

  await cookieStore.set("session_id");

  await createSession(newSessionId, newSession);
  console.log(`New session created: ${newSessionId}`);

  return { sessionId: newSessionId, data: newSession };
};

export const updateCurrentSession = async (
  data: SessionData
): Promise<void> => {
  const { sessionId, data: oldData } = await getCurrentSession();
  const newData = { ...oldData, ...data };
  await createSession(sessionId, newData);
  console.log(`Session updated: ${sessionId}`, newData);
};

export const generateWebAuthnRegistrationOptions = async (email: string) => {
  const user = await findUser(email);

  if (user) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: "SimpleWebAuthn Example",
    rpID: rpId,
    userID: email,
    userName: email,
    timeout: 60000,
    attestationType: "none",
    excludeCredentials: [],
    authenticatorSelection: {
      residentKey: "discouraged",
    },
    supportedAlgorithmIDs: [-7, -257],
  };

  const options = await generateRegistrationOptions(opts);
  console.log("Generated registration options:", options);
  try {
    await updateCurrentSession({
      currentChallenge: options.challenge,
      email,
      data: { undefined },
    });
    console.log("Session updated with registration challenge");
  } catch (error) {
    console.log("Error updating session", error);
  }
  return {
    success: true,
    data: options,
  };
};

export const verifyWebAuthnRegistration = async (
  data: RegistrationResponseJSON
) => {
  const { data: sessionData } = await getCurrentSession();
  console.log("Session data:", sessionData);

  const email = sessionData.data.email;
  const currentChallenge = sessionData.data.currentChallenge;

  console.log("Reg:", email);
  console.log("Reg:", currentChallenge);

  if (!email || !currentChallenge) {
    return {
      success: false,
      message: "Session expired",
    };
  }

  const expectedChallenge = currentChallenge;

  const opts: VerifyRegistrationResponseOpts = {
    response: data,
    expectedChallenge: `${expectedChallenge}`,
    expectedOrigin: origin,
    expectedRPID: rpId,
    requireUserVerification: false,
  };

  const verification = await verifyRegistrationResponse(opts);
  console.log("Registration verification result:", verification);

  const { verified, registrationInfo } = verification;

  if (!verified || !registrationInfo) {
    return {
      success: false,
      message: "Registration failed",
    };
  }

  const { credentialPublicKey, credentialID, counter } = registrationInfo;

  const newDevice: UserDevice = {
    credentialPublicKey: isoBase64URL.fromBuffer(credentialPublicKey),
    credentialID: isoBase64URL.fromBuffer(credentialID),
    counter,
    transports: data.response.transports,
  };

  await updateCurrentSession({
    currentChallenge: "",
    email: "",
    data: {},
  });
  console.log("Session cleared after registration");

  try {
    await createUser(email, [newDevice]);
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "User already exists",
    };
  }

  return {
    success: true,
  };
};

export const generateWebAuthnLoginOptions = async (email: string) => {
  const user = await findUser(email);
  console.log("User found:", user);

  if (!user) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: user.devices.map((dev) => ({
      id: isoBase64URL.toBuffer(dev.credentialID),
      type: "public-key",
      transports: dev.transports,
    })),
    userVerification: "required",
    rpID: rpId,
  };

  const options = await generateAuthenticationOptions(opts);
  console.log("Generated authentication options:", options);

  await updateCurrentSession({
    currentChallenge: options.challenge,
    email,
    data: {},
  });
  console.log("Session updated with authentication challenge");

  return {
    success: true,
    data: options,
  };
};

export const verifyWebAuthnLogin = async (data: AuthenticationResponseJSON) => {
  const { data: sessionData } = await getCurrentSession();
  console.log("Session data:", sessionData);

  const email = sessionData.data.email;
  const currentChallenge = sessionData.data.currentChallenge;

  console.log("verify:", email, currentChallenge);

  if (!email || !currentChallenge) {
    return {
      success: false,
      message: "Session expired",
    };
  }

  const user = await findUser(email);
  console.log("User found:", user);

  if (!user) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const dbAuthenticator = user.devices.find(
    (dev) => dev.credentialID === data.rawId
  );
  console.log("Authenticator found:", dbAuthenticator);

  if (!dbAuthenticator) {
    return {
      success: false,
      message: "Authenticator is not registered with this site",
    };
  }

  const opts: VerifyAuthenticationResponseOpts = {
    response: data,
    expectedChallenge: `${currentChallenge}`,
    expectedOrigin: origin,
    expectedRPID: rpId,
    authenticator: {
      ...dbAuthenticator,
      credentialID: isoBase64URL.toBuffer(dbAuthenticator.credentialID),
      credentialPublicKey: isoBase64URL.toBuffer(
        dbAuthenticator.credentialPublicKey
      ),
      counter: 0,
    },
    requireUserVerification: true,
  };

  const verification = await verifyAuthenticationResponse(opts);
  console.log("Authentication verification result:", verification);

  await updateCurrentSession({
    currentChallenge: "",
    email: "",
    data: {},
  });
  console.log("Session cleared after login");

  return {
    success: verification.verified,
  };
};
