import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const contactTypeEnum = pgEnum("contact_type", [
  "general",
  "collaboration",
  "research_partnership",
  "publication_support",
  "recognition_request",
  "technical_support",
  "paper_submission",
]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied", "archived"]);
export const researchCategoryEnum = pgEnum("research_category", ["genomics", "bioinformatics", "biotechnology", "clinical_trials", "ai_life_sciences", "synthetic_biology", "cell_biology", "structural_biology", "other"]);
export const publishStatusEnum = pgEnum("publish_status", ["draft", "published"]);
export const newsCategoryEnum = pgEnum("news_category", ["research", "industry", "events", "policy", "funding", "announcement"]);
export const eventTypeEnum = pgEnum("event_type", ["conference", "workshop", "webinar", "summit", "symposium", "networking"]);
export const eventStatusEnum = pgEnum("event_status", ["upcoming", "ongoing", "past", "cancelled"]);
export const partnershipTypeEnum = pgEnum("partnership_type", ["institutional", "industry", "government", "ngo", "startup"]);
export const partnershipStatusEnum = pgEnum("partnership_status", ["pending", "approved", "rejected", "active"]);
export const organizationTypeEnum = pgEnum("organization_type", ["institute", "university", "organization", "lab", "research_group", "journal", "partner"]);
export const recognitionStatusEnum = pgEnum("recognition_status", ["recognized", "partner", "affiliated"]);
export const paperSubmissionStatusEnum = pgEnum("paper_submission_status", ["pending", "under_review", "accepted", "rejected", "published"]);

// Users (Username/Password)
// Note: every row here is created only after email confirmation (see auth.completeRegistration),
// so there is no separate emailVerified flag — existence in this table implies a verified email.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Contact Submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: contactTypeEnum("type").default("general").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter Subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Research Articles (formerly Publications — extended with full article content)
export const researchArticles = pgTable("research_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  authors: text("authors").notNull(),
  abstract: text("abstract"),
  content: text("content"),
  references: text("references"),
  journal: varchar("journal", { length: 255 }),
  doi: varchar("doi", { length: 255 }),
  publishDate: date("publish_date"),
  category: researchCategoryEnum("category").default("other").notNull(),
  status: publishStatusEnum("status").default("draft").notNull(),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  coverImage: varchar("cover_image", { length: 500 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// News/Insights
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  category: newsCategoryEnum("category").default("announcement").notNull(),
  status: publishStatusEnum("status").default("draft").notNull(),
  author: varchar("author", { length: 255 }),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").default("conference").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 500 }),
  isVirtual: boolean("is_virtual").default(false).notNull(),
  registrationUrl: varchar("registration_url", { length: 500 }),
  coverImage: varchar("cover_image", { length: 500 }),
  status: eventStatusEnum("status").default("upcoming").notNull(),
  publishStatus: publishStatusEnum("publish_status").default("draft").notNull(),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Researchers
export const researchers = pgTable("researchers", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  institution: varchar("institution", { length: 255 }),
  country: varchar("country", { length: 255 }),
  bio: text("bio"),
  researchAreas: text("research_areas"),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  profileImage: varchar("profile_image", { length: 500 }),
  publications: integer("publications").default(0).notNull(),
  citations: integer("citations").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Partnerships (a.k.a. Recognition Requests — applications to join/be recognized)
export const partnerships = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organization_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  partnershipType: partnershipTypeEnum("partnership_type").notNull(),
  description: text("description"),
  website: varchar("website", { length: 500 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  country: varchar("country", { length: 255 }),
  status: partnershipStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Organizations (public Network/Recognition directory)
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: varchar("logo_url", { length: 500 }),
  description: text("description"),
  website: varchar("website", { length: 500 }),
  type: organizationTypeEnum("type").default("organization").notNull(),
  collaborationDetails: text("collaboration_details"),
  recognitionStatus: recognitionStatusEnum("recognition_status").default("affiliated").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Paper Submissions
export const paperSubmissions = pgTable("paper_submissions", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  affiliation: varchar("affiliation", { length: 500 }),
  email: varchar("email", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  abstract: text("abstract").notNull(),
  keywords: text("keywords"),
  manuscriptUrl: varchar("manuscript_url", { length: 500 }).notNull(),
  supportingFileUrls: text("supporting_file_urls"),
  coverLetter: text("cover_letter"),
  status: paperSubmissionStatusEnum("status").default("pending").notNull(),
  userId: integer("user_id").references(() => users.id),
  adminNotes: text("admin_notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Media Library
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  altText: varchar("alt_text", { length: 255 }),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorTitle: varchar("author_title", { length: 255 }),
  authorInstitution: varchar("author_institution", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type ResearchArticle = typeof researchArticles.$inferSelect;
export type News = typeof news.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Researcher = typeof researchers.$inferSelect;
export type Partnership = typeof partnerships.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type PaperSubmission = typeof paperSubmissions.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
