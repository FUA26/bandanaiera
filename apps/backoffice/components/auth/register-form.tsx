"use client";

/**
 * Registration Form Component
 *
 * Form for public user registration
 */

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  // Password strength calculator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "Weak", color: "bg-red-500" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 50, label: "Fair", color: "bg-yellow-500" };
    if (score <= 3) return { score: 75, label: "Good", color: "bg-blue-500" };
    return { score: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(passwordValue || "");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // Check if email verification is required
      if (result.requireEmailVerification) {
        setRequireEmailVerification(true);
        setRegistrationSuccess(true);
      } else {
        toast.success("Registration successful! You can now log in.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if registration completed
  if (registrationSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Registration Successful!</h3>
          <p className="text-muted-foreground">
            {requireEmailVerification
              ? "We&apos;ve sent a verification email to your address. Please check your email and click the verification link to activate your account."
              : "Your account has been created successfully."}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          {requireEmailVerification && (
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccess(false);
                  setRequireEmailVerification(false);
                  form.reset();
                }}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </p>
          )}

          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formState = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <Field>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <FieldDescription>Enter your full name</FieldDescription>
        <FieldContent>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            {...form.register("name")}
          />
        </FieldContent>
        <FieldError />
      </Field>

      {/* Email */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldDescription>Enter your email address</FieldDescription>
        <FieldContent>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            disabled={isLoading}
            {...form.register("email")}
          />
        </FieldContent>
        <FieldError />
      </Field>

      {/* Password */}
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <FieldDescription>Enter a secure password</FieldDescription>
        <FieldContent>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <HugeiconsIcon icon={ViewOffIcon} className="h-5 w-5" />
              ) : (
                <HugeiconsIcon icon={EyeIcon} className="h-5 w-5" />
              )}
            </button>
          </div>
        </FieldContent>
        <FieldError />
      </Field>

      {/* Password Strength Indicator */}
      {passwordValue && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Password strength:</span>
            <span
              className={`font-medium ${
                passwordStrength.score === 25
                  ? "text-red-500"
                  : passwordStrength.score === 50
                    ? "text-yellow-500"
                    : passwordStrength.score === 75
                      ? "text-blue-500"
                      : "text-green-500"
              }`}
            >
              {passwordStrength.label}
            </span>
          </div>
          <Progress value={passwordStrength.score} className="h-2" />
        </div>
      )}

      {/* Confirm Password */}
      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <FieldDescription>Re-enter your password</FieldDescription>
        <FieldContent>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              {...form.register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <HugeiconsIcon icon={ViewOffIcon} className="h-5 w-5" />
              ) : (
                <HugeiconsIcon icon={EyeIcon} className="h-5 w-5" />
              )}
            </button>
          </div>
        </FieldContent>
        <FieldError />
      </Field>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
