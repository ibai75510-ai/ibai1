import { getDb } from "../api/queries/connection";
import { researchArticles, news, events, organizations } from "./schema";
import { fallbackResearchArticles } from "../src/data/fallbackResearchArticles";
import { fallbackNews } from "../src/data/fallbackNews";
import { fallbackEvents } from "../src/data/fallbackEvents";
import { partnerOrganizations } from "../src/data/partnerOrganizations";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const orgTypeByName: Record<string, "institute" | "university"> = {
  MIT: "institute",
  "ETH Zurich": "institute",
  "Max Planck Institute": "institute",
  "Karolinska Institute": "institute",
  "Weizmann Institute": "institute",
};

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  await db
    .insert(researchArticles)
    .values(
      fallbackResearchArticles.map((a) => ({
        title: a.title,
        slug: a.slug,
        authors: a.authors,
        abstract: a.abstract,
        content: a.content,
        references: a.references,
        journal: a.journal,
        doi: a.doi,
        publishDate: a.publishDate,
        category: a.category as any,
        status: "published" as const,
        pdfUrl: a.pdfUrl ?? undefined,
        downloadCount: a.downloadCount,
        isFeatured: a.isFeatured,
      }))
    )
    .onConflictDoNothing({ target: researchArticles.slug });
  console.log(`Seeded ${fallbackResearchArticles.length} research articles.`);

  await db
    .insert(news)
    .values(
      fallbackNews.map((n) => ({
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        content: n.content,
        coverImage: n.coverImage,
        category: n.category as any,
        status: "published" as const,
        author: n.author,
        publishedAt: new Date(n.publishedAt),
        isFeatured: n.isFeatured,
      }))
    )
    .onConflictDoNothing({ target: news.slug });
  console.log(`Seeded ${fallbackNews.length} news articles.`);

  await db.insert(events).values(
    fallbackEvents.map((e) => ({
      title: e.title,
      description: e.description,
      eventType: e.eventType as any,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : undefined,
      location: e.location,
      isVirtual: e.isVirtual,
      registrationUrl: e.registrationUrl ?? undefined,
      coverImage: e.coverImage,
      status: e.status as any,
      publishStatus: "published" as const,
      maxAttendees: e.maxAttendees,
    }))
  );
  console.log(`Seeded ${fallbackEvents.length} events.`);

  await db
    .insert(organizations)
    .values(
      partnerOrganizations.map((name, i) => ({
        name,
        slug: slugify(name),
        type: orgTypeByName[name] ?? "university",
        recognitionStatus: "recognized" as const,
        description: `${name} is a globally recognized IBA-affiliated institution contributing to the bioscience research network.`,
        collaborationDetails: "Active research collaboration and data-sharing partner within the IBA network.",
        isFeatured: i < 4,
      }))
    )
    .onConflictDoNothing({ target: organizations.slug });
  console.log(`Seeded ${partnerOrganizations.length} organizations.`);

  console.log("Done.");
  process.exit(0);
}

seed();
