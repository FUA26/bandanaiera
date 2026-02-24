/**
 * Registration Page
 *
 * Public page for user registration
 */

import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account to get started",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
      <RegisterForm />
    </div>
  );
}
