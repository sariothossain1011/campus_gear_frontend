"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginValues } from "@/lib/auth-schemas";

import { FormAlert } from "./form-alert";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    // Validate a field once the user has left it, then keep it live while they
    // fix it. Validating on every keystroke of a first attempt would flag an
    // email as invalid halfway through typing it.
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      // TODO: replace with the real sign-in call. Server-side failures belong
      // on `root` — they describe the attempt, not any one field.
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Signed in", {
        description: `Welcome back, ${values.email}.`,
      });
    } catch {
      setError("root", {
        message: "We could not sign you in. Check your details and try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {errors.root ? <FormAlert>{errors.root.message}</FormAlert> : null}

      <Field label="Campus email" error={errors.email?.message}>
        {(field) => (
          <Input
            {...field}
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
          />
        )}
      </Field>

      <Field
        label="Password"
        error={errors.password?.message}
        action={
          <Link
            href="/forgot-password"
            className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
          >
            Forgot?
          </Link>
        }
      >
        {(field) => (
          <PasswordInput
            {...field}
            {...register("password")}
            autoComplete="current-password"
            placeholder="Your password"
          />
        )}
      </Field>

      {/* Radix's checkbox is not a native input, so it is driven through a
          Controller rather than `register`. */}
      <Controller
        control={control}
        name="rememberMe"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id="remember-me"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.onBlur}
              ref={field.ref}
            />
            <label
              htmlFor="remember-me"
              className="cursor-pointer text-xs leading-5 text-foreground/70 select-none"
            >
              Keep me signed in
            </label>
          </div>
        )}
      />

      <Button
        type="submit"
        variant="primary"
        size="xl"
        disabled={isSubmitting}
        className="mt-2 w-full"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" />
            Signing in
          </>
        ) : (
          <>
            Sign in
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
