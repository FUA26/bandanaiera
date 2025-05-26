import {TypeOf, object, string} from "zod";

// Skema untuk login pengguna
export const loginUserSchema = object({
  email: string({required_error: "Email wajib diisi"})
    .min(1, "Email wajib diisi")
    .email("Email atau kata sandi tidak valid"),
  password: string({required_error: "Kata sandi wajib diisi"}).min(1, "Kata sandi wajib diisi"),
});

// Tipe TypeScript
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
