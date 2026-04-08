import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SitePreview } from "../../../components/site-preview";
import { getProjectBySlug } from "../../../lib/project-store";

export async function generateMetadata(
  context: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found — Baggable",
    };
  }

  return {
    title: `${project.draft.projectName} — Baggable`,
    description: project.draft.tagline,
  };
}

export default async function PublishedProjectPage(
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="published-page">
      <div className="published-page-inner">
        <div className="published-page-top">
          <Link href="/" className="published-page-back">
            Back to Baggable
          </Link>
        </div>

        <SitePreview draft={project.draft} published />
      </div>
    </div>
  );
}
