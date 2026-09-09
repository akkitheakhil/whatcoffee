import { NextResponse } from "next/server";
import { z } from "zod";

const suggestionSchema = z.object({
  drink: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1_000),
  served: z.enum(["Hot", "Iced", "Cold", "Hot & cold", "Either"]),
  name: z.string().trim().max(80).transform((value) => value.length > 0 ? value : "Anonymous"),
  recipe: z.string().trim().min(10).max(5_000),
  website: z.string().trim().max(200).optional().default(""),
});

type Suggestion = z.infer<typeof suggestionSchema>;

const getIssueUrl = (value: unknown) => {
  if (typeof value !== "object" || value === null || !("html_url" in value)) return null;
  const issue = value as { html_url?: unknown };
  return typeof issue.html_url === "string" ? issue.html_url : null;
};

const createIssueBody = (suggestion: Suggestion) => [
  "## Suggested drink",
  suggestion.drink,
  "",
  "## Why try it?",
  suggestion.description,
  "",
  "## Served",
  suggestion.served,
  "",
  "## Recipe",
  suggestion.recipe,
  "",
  "## Suggested by",
  suggestion.name,
  "",
  "Submitted through the WhatCoffee recipe suggestion form.",
].join("\n");

export const POST = async (request: Request) => {
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "That suggestion could not be read." }, { status: 400 });
  }

  const parsedSuggestion = suggestionSchema.safeParse(requestBody);
  if (!parsedSuggestion.success) {
    return NextResponse.json({ error: "Please complete the required fields and try again." }, { status: 400 });
  }

  const suggestion = parsedSuggestion.data;
  if (suggestion.website.length > 0) {
    return NextResponse.json({ issueUrl: null }, { status: 201 });
  }

  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY ?? "akkitheakhil/whatcoffee";
  if (!token) {
    return NextResponse.json({ error: "Recipe suggestions are not connected yet. Please try again later." }, { status: 503 });
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) {
    console.error("Invalid GITHUB_REPOSITORY configuration.");
    return NextResponse.json({ error: "Recipe suggestions are temporarily unavailable." }, { status: 500 });
  }

  let githubResponse: Response;
  try {
    githubResponse = await fetch(`https://api.github.com/repos/${repository}/issues`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "WhatCoffee",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      body: JSON.stringify({
        title: `Recipe suggestion: ${suggestion.drink}`,
        body: createIssueBody(suggestion),
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("GitHub issue request failed.", error);
    return NextResponse.json({ error: "We could not send that suggestion right now. Please try again." }, { status: 502 });
  }

  let responseBody: unknown = null;
  try {
    responseBody = await githubResponse.json();
  } catch {
    responseBody = null;
  }

  if (!githubResponse.ok) {
    console.error("GitHub issue creation failed.", { status: githubResponse.status });
    return NextResponse.json({ error: "We could not send that suggestion right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ issueUrl: getIssueUrl(responseBody) }, { status: 201 });
};
