// lib/actions.ts

"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import AuthError from "next-auth";
import { hash } from "bcrypt";

export async function ensureUsersTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// Define validation schema for signup form
const SignupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export async function registerUser(formData: FormData) {
  const validatedFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed",
    };
  }

  const { name, email, password } = validatedFields.data;
  const userRole = "user";
  const hashedPassword = await hash(password, 12);

  try {
    await sql`
      INSERT INTO users (name, email, role, password)
      VALUES (${name}, ${email}, ${userRole}, ${hashedPassword})
    `;
    revalidatePath("/dashboard/users");
    await signIn("credentials", formData, { redirectTo: "/home" });

    return; // Success
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// Define a schema for resetting the password.
// It expects an email, a new password, and a confirmation (which must match).
const ResetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // Validate the form data
    const validated = ResetPasswordSchema.safeParse({
      email: formData.get("email"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const { email, newPassword } = validated.data;
    // Check that the user exists
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!rows.length) {
      throw new Error("User not found");
    }

    // Hash the new password and update the user's record
    const hashedPassword = await hash(newPassword, 12);
    console.log("Reset password action triggered:", formData.get("email"));
    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE email = ${email}
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error occurred resetting password:  ", error);
  }
  return "Password reset successfully!";
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData, {
      redirectTo: "/home",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log("Error occurred during authentication: ", error?.cause?.err);
    switch (error.type) {
      case "CredentialsSignin":
        return error.cause.err.message;
      case "CallbackRouteError":
        return error.cause.err.message;
      case "User not found":
        return error.cause.err.message;
      default:
        redirect("/login");
    }
  }
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: `Database Error: Failed to Create Invoice: ${error}`,
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice: ${error}`,
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return {
      message: `Database Error: Failed to Delete Invoice: ${error}`,
    };
  }
}
