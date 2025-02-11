import bcrypt from "bcrypt";

export function saltAndHashPassword(password) {
  if (!password) {
    throw new Error("Password is required");
  }

  const saltRounds = 10; // You can adjust this for security vs. performance
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
}
