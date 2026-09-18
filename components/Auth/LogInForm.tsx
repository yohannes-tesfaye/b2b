"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { FieldSet, FieldSeparator } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import { logIn } from "@/utils/auth/log-in-action";

function LogInForm() {
  const [state, formAction] = useActionState(logIn, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Log In</h1>
      <FieldSet className="gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </FieldSet>
      <FieldSet className="gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
      </FieldSet>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <FieldSeparator>or continue with</FieldSeparator>
      <OAuthButtons />
      <Button type="submit" className="w-full">
        Log In
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LogInForm;