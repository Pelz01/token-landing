import { NextResponse } from "next/server";

import { createAssistantMessage, generateDraft } from "../../../../lib/generator";
import { getProjectById, upsertProjectDraft } from "../../../../lib/project-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: string; projectId?: string };
    const prompt = body.prompt?.trim() ?? "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const existing = body.projectId ? await getProjectById(body.projectId) : null;
    const draft = generateDraft({
      prompt,
      currentDraft: existing?.draft,
    });
    const project = await upsertProjectDraft({
      projectId: existing?.id,
      prompt,
      draft,
    });

    return NextResponse.json({
      project,
      assistantMessage: createAssistantMessage(draft),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate the project draft.",
      },
      { status: 500 },
    );
  }
}
