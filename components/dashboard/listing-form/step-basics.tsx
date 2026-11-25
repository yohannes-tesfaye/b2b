"use client";

import { useTranslations } from "next-intl";
import { StepBasicsGrid } from "./step-basics-grid";
import { TextField } from "./text-field";
import type { StepProps } from "./types";

/** Step 2: title, description and the basics grid. */
export function StepBasics(props: StepProps) {
  const t = useTranslations("listingForm");

  return (
    <section className="flex flex-col gap-(--spacing-6)">
      <h2 className="text-base font-semibold">{t("basicsTitle")}</h2>
      <div className="flex flex-col gap-(--spacing-4)">
        <TextField
          id="title"
          label="Title"
          value={props.values.title}
          error={props.errors.title}
          placeholder="e.g. Premium green coffee beans, 500 kg"
          onChange={(value) => props.onChange("title", value)}
          onTouch={() => props.onTouch("title")}
        />
        <TextField
          id="description"
          label="Description"
          value={props.values.description}
          error={props.errors.description}
          hint="Describe the goods, requirements, and any important terms."
          placeholder="Add the details a buyer or supplier needs to respond."
          multiline
          rows={4}
          onChange={(value) => props.onChange("description", value)}
          onTouch={() => props.onTouch("description")}
        />
      </div>
      <StepBasicsGrid {...props} />
    </section>
  );
}
