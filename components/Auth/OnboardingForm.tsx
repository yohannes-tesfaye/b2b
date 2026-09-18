"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { Button } from "../ui/button";
import { FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { finishOnboarding } from "@/utils/auth/onboarding-action";

const ROLES = [
  { value: "supplier", label: "I'm a Supplier" },
  { value: "buyer", label: "I'm a Buyer" },
  { value: "trade-service-provider", label: "I'm a Trade Service Provider" },
];

const INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Electronics",
  "Machinery",
  "Textiles",
  "Other",
];

function OnboardingForm({
  step,
  onStepChange,
}: {
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
}) {
  const [roles, setRoles] = useState<string[]>([]);
  const [industry, setIndustry] = useState("");
  const [state, formAction] = useActionState(finishOnboarding, { error: null });

  const toggleRole = (value: string) => {
    setRoles((prev) =>
      prev.includes(value)
        ? prev.filter((role) => role !== value)
        : [...prev, value]
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {step === 1 ? "Select your role" : "Business information"}
        </h1>
        <p className="text-sm text-muted-foreground">Step {step} of 2</p>
      </div>

      {step === 1 ? (
        <>
          <p className="text-sm text-muted-foreground">
            What best describes your business? Choose at least one.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ROLES.map((role) => {
              const selected = roles.includes(role.value);
              return (
                <button
                  key={role.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleRole(role.value)}
                  className={cn(
                    "flex min-h-[100px] flex-col items-start justify-between gap-2 rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-transparent hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {selected && <Check className="size-3.5" />}
                  </span>
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              );
            })}
          </div>
          <Button
            type="button"
            className="w-full"
            disabled={!roles.length}
            onClick={() => onStepChange(2)}
          >
            Next
          </Button>
        </>
      ) : (
        <>
          <FieldSet className="gap-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Acme Trading Inc."
              required
            />
          </FieldSet>
          <FieldSet className="gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              required
            />
          </FieldSet>
          <FieldSet className="gap-2">
            <Label htmlFor="website">Company website</Label>
            <Input
              type="url"
              id="website"
              name="website"
              placeholder="https://acme.com"
              autoComplete="url"
            />
          </FieldSet>
          <FieldSet className="gap-2">
            <Label htmlFor="industry">Business category</Label>
            <Select
              name="industry"
              value={industry}
              onValueChange={(value) => setIndustry(String(value ?? ""))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldSet>

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onStepChange(1)}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Marketplace
              <ChevronRight />
            </Button>
          </div>
        </>
      )}

      {roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}
    </form>
  );
}

export default OnboardingForm;