"use client";

/**
 * Forgot Password Form Component
 *
 * Form for users to request a password reset email
 */

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset email");
      }

      setIsSuccess(true);
      toast.success("If an account exists with that email, a password reset link has been sent.");
    } catch (error) {
      console.error("Failed to send reset email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={Mail01Icon} className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to your email address. Please check your inbox and follow
            the instructions.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium">Didn&apos;t receive the email?</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
            <li>Check your spam or junk folder</li>
            <li>Make sure the email address is correct</li>
            <li>Wait a few minutes for the email to arrive</li>
          </ul>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setIsSuccess(false);
            form.reset();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            {...form.register("email")}
            disabled={isLoading}
          />
        </FieldContent>
        <FieldError
          errors={form.formState.errors.email ? [form.formState.errors.email] : undefined}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <HugeiconsIcon icon={Mail01Icon} className="mr-2 h-4 w-4" />
            Send Reset Link
          </>
        )}
      </Button>

      <div className="text-center text-sm">
        <a href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to login
        </a>
      </div>
    </form>
  );
}
