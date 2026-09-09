"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowIcon } from "./icons";

type SubmissionState =
  | { readonly status: "idle" }
  | { readonly status: "submitting" }
  | { readonly status: "success"; readonly issueUrl: string | null }
  | { readonly status: "error"; readonly message: string };

type SuggestionResponse = {
  readonly issueUrl?: unknown;
  readonly error?: unknown;
};

const DEFAULT_ERROR_MESSAGE = "We could not send that suggestion right now. Please try again.";

const readFormValue = (formData: FormData, fieldName: string) => {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
};

export function SuggestionForm() {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmission({ status: "submitting" });

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drink: readFormValue(formData, "drink"),
          description: readFormValue(formData, "description"),
          served: readFormValue(formData, "served"),
          name: readFormValue(formData, "name"),
          recipe: readFormValue(formData, "recipe"),
          website: readFormValue(formData, "website"),
        }),
      });

      let responseBody: SuggestionResponse | null = null;
      try {
        responseBody = await response.json() as SuggestionResponse;
      } catch {
        responseBody = null;
      }

      if (!response.ok) {
        const serverMessage = typeof responseBody?.error === "string" ? responseBody.error : DEFAULT_ERROR_MESSAGE;
        throw new Error(serverMessage);
      }

      const issueUrl = typeof responseBody?.issueUrl === "string" ? responseBody.issueUrl : null;
      form.reset();
      setSubmission({ status: "success", issueUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
      setSubmission({ status: "error", message });
    }
  };

  if (submission.status === "success") {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>Suggestion sent</h2>
        <p>Thanks—your recipe is now queued for community review.</p>
        {submission.issueUrl ? (
          <a className="form-issue-link" href={submission.issueUrl} target="_blank" rel="noreferrer">
            View GitHub issue <ArrowIcon />
          </a>
        ) : null}
        <button type="button" className="button button-outline" onClick={() => setSubmission({ status: "idle" })}>Suggest another</button>
      </div>
    );
  }

  return (
    <form className="suggestion-form" onSubmit={handleSubmit} aria-busy={submission.status === "submitting"}>
      <label>
        <span>Drink name</span>
        <input name="drink" required placeholder="e.g. Freddo cappuccino" />
      </label>
      <label>
        <span>What makes it worth trying?</span>
        <textarea name="description" required rows={4} placeholder="A short description of the drink." />
      </label>
      <div className="form-row">
        <label>
          <span>Served</span>
          <select name="served" defaultValue="Hot"><option>Hot</option><option>Iced</option><option>Cold</option><option>Hot &amp; cold</option><option>Either</option></select>
        </label>
        <label>
          <span>Your name <small>optional</small></span>
          <input name="name" placeholder="How we should credit you" />
        </label>
      </div>
      <label>
        <span>Recipe</span>
        <textarea name="recipe" required rows={7} placeholder={"Ingredients and steps\n\n18 g coffee\n36 g espresso\n…"} />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {submission.status === "error" ? <p className="form-error" role="alert">{submission.message}</p> : null}
      <button type="submit" className="button button-primary" disabled={submission.status === "submitting"}>
        {submission.status === "submitting" ? "Sending…" : "Send suggestion"} <ArrowIcon />
      </button>
      <p className="form-note">Suggestions are sent to the WhatCoffee GitHub repository for review.</p>
    </form>
  );
}
