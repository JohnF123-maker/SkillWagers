import { z } from "zod";

const email = z.string()
  .trim()
  .min(1, "Email address is required")
  .email("Enter a valid email address");

const password = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

const displayName = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .min(2, "Display name must be at least 2 characters")
  .max(50, "Display name is too long");

/**
 * DOB validator that only accepts real dates (YYYY-MM-DD),
 * forces 4-digit year within a sane range, and rejects impossible dates.
 */
const currentYear = new Date().getFullYear();
const dob = z
  .string()
  .min(1, "Date of birth is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
  .refine((v) => {
    const [y, m, d] = v.split("-").map(Number);
    if (y < 1930 || y > currentYear) return false;
    const dt = new Date(v);
    // Date() autocorrects invalid dates; re-check components
    return (
      dt instanceof Date &&
      !isNaN(dt.getTime()) &&
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() + 1 === m &&
      dt.getUTCDate() === d
    );
  }, "Please enter a real date")
  .refine((v) => {
    const birthDate = new Date(v);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
               (today.getMonth() < birthDate.getMonth() || 
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
    return age >= 18;
  }, "You must be 18 or older to register");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"), // Less strict for login
});

export const registerSchema = z.object({
  displayName,
  email,
  dateOfBirth: dob,
  password,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});