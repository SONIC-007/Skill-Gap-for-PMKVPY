import { z } from "zod";

const optionalTrimmed = (maxLen = 300) =>
    z
        .string()
        .trim()
        .max(maxLen, `Must be ${maxLen} characters or fewer`)
        .optional()
        .or(z.literal(""));

export const registerSchema = z
    .object({
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
        email: z.string().trim().email("Invalid email address").max(254, "Email is too long"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(128, "Password must be 128 characters or fewer"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(254),
    password: z.string().min(1, "Password is required").max(128),
});

export const profileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
    phone: optionalTrimmed(30),
    education: optionalTrimmed(200),
    experience: optionalTrimmed(120),
    location: optionalTrimmed(160),
    desiredCareerField: optionalTrimmed(120),
    targetJobRole: optionalTrimmed(160),
    bio: optionalTrimmed(1500),
});
