"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AccountTypeField } from "@/components/auth/account-type-field";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordMeter } from "@/components/auth/password-meter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupValues } from "@/lib/auth-schemas";

import { FormAlert } from "./form-alert";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      // Left unset so the schema's enum check can require a deliberate choice
      // rather than the form silently defaulting someone into a role.
      accountType: undefined,
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Drives the strength meter only; the schema stays the source of truth for
  // whether the value is acceptable. `useWatch` rather than `watch()` — the
  // latter returns a fresh function each render, which the React Compiler
  // cannot memoize, so it bails out of optimising the whole component.
  const password = useWatch({ control, name: "password" });

  const onSubmit = async (values: SignupValues) => {
    try {
      // TODO: replace with the real account-creation call. A duplicate email
      // comes back from the server, so report it on the field it belongs to:
      // setError("email", { message: "That email is already registered." })
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast.success("Account created", {
        description: `Check ${values.email} for your confirmation link.`,
      });
    } catch {
      setError("root", {
        message: "We could not create your account. Try again in a moment.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {errors.root ? <FormAlert>{errors.root.message}</FormAlert> : null}

      <Field label="Full name" error={errors.fullName?.message}>
        {(field) => (
          <Input
            {...field}
            {...register("fullName")}
            autoComplete="name"
            placeholder="Ada Rahman"
          />
        )}
      </Field>

      <Field
        label="Campus email"
        error={errors.email?.message}
        hint="Use your university address so listings show on your campus first."
      >
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

      <AccountTypeField
        registration={register("accountType")}
        error={errors.accountType?.message}
      />

      <Field label="Password" error={errors.password?.message}>
        {(field) => (
          <>
            <PasswordInput
              {...field}
              {...register("password")}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <PasswordMeter value={password ?? ""} />
          </>
        )}
      </Field>

      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        {(field) => (
          <PasswordInput
            {...field}
            {...register("confirmPassword")}
            autoComplete="new-password"
            placeholder="Repeat your password"
          />
        )}
      </Field>

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                ref={field.ref}
                aria-invalid={errors.acceptTerms ? true : undefined}
                aria-describedby={
                  errors.acceptTerms ? "accept-terms-error" : undefined
                }
                className="mt-0.5"
              />
              <label
                htmlFor="accept-terms"
                className="cursor-pointer text-xs leading-5 text-foreground/70 select-none"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-bold text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
                >
                  rental terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-bold text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
                >
                  privacy policy
                </Link>
                .
              </label>
            </div>

            {errors.acceptTerms ? (
              <p
                id="accept-terms-error"
                role="alert"
                className="flex items-start gap-2 font-mono text-[0.68rem] font-bold leading-5 text-destructive"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 bg-destructive"
                />
                {errors.acceptTerms.message}
              </p>
            ) : null}
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
            Creating account
          </>
        ) : (
          <>
            Create account
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
