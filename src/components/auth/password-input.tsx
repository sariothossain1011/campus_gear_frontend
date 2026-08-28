"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Password field with a reveal toggle.
 *
 * The toggle is a real button so it is reachable by keyboard, and its label
 * changes with the state so a screen reader announces what pressing it will
 * do. The input keeps `type=password` in the DOM until the user asks
 * otherwise, so managers still recognise it.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-14", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        // Not part of the form's tab order on the way to submit — but still
        // focusable, so it stays operable without a pointer.
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-14 place-items-center text-foreground/55 transition-colors hover:text-foreground"
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="size-4.5" />
        ) : (
          <Eye aria-hidden="true" className="size-4.5" />
        )}
      </button>
    </div>
  );
}
