"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { FieldSet, FieldSeparator } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import OAuthButtons from "./OAuthButtons";
import { signUp } from "@/utils/auth/sign-up-action";

function SignUpForm() {
  const [state, formAction] = useActionState(signUp, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Sign Up</h1>
      <FieldSet className="gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </FieldSet>
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
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          autoComplete="new-password"
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
        Sign Up
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Have an account?
        <Link
          href="/log-in"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
