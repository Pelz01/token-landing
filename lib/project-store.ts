import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { ProjectRecord, SiteDraft } from "./builder-types";

type StoreShape = {
  projects: ProjectRecord[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "projects.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await readFile(STORE_FILE, "utf8");
    return JSON.parse(raw) as StoreShape;
  } catch {
    const initial: StoreShape = { projects: [] };
    await writeFile(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

async function saveStore(store: StoreShape) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function uniqueSlug(base: string, projects: ProjectRecord[]) {
  const normalized = slugify(base) || "project";
  let candidate = normalized;
  let counter = 2;

  while (projects.some((project) => project.slug === candidate)) {
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export async function getProjectById(projectId: string) {
  const store = await ensureStore();
  return store.projects.find((project) => project.id === projectId) ?? null;
}

export async function getProjectBySlug(slug: string) {
  const store = await ensureStore();
  return store.projects.find((project) => project.slug === slug) ?? null;
}

export async function upsertProjectDraft({
  projectId,
  prompt,
  draft,
}: {
  projectId?: string;
  prompt: string;
  draft: SiteDraft;
}) {
  const store = await ensureStore();
  const now = new Date().toISOString();
  const existing = projectId
    ? store.projects.find((project) => project.id === projectId) ?? null
    : null;

  if (existing) {
    existing.updatedAt = now;
    existing.draft = draft;
    existing.prompts.push(prompt);
    await saveStore(store);
    return existing;
  }

  const created: ProjectRecord = {
    id: randomUUID(),
    slug: null,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    prompts: [prompt],
    draft,
  };

  store.projects.unshift(created);
  await saveStore(store);
  return created;
}

export async function publishProject(projectId: string) {
  const store = await ensureStore();
  const project = store.projects.find((entry) => entry.id === projectId);

  if (!project) {
    return null;
  }

  if (!project.slug) {
    project.slug = uniqueSlug(project.draft.projectName, store.projects);
  }

  project.publishedAt = project.publishedAt ?? new Date().toISOString();
  project.updatedAt = new Date().toISOString();
  await saveStore(store);
  return project;
}
