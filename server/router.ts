import { authRouter } from "./routers/auth";
import { contactRouter } from "./routers/contact";
import { subscriberRouter } from "./routers/subscriber";
import { researchArticleRouter } from "./routers/researchArticle";
import { newsRouter } from "./routers/news";
import { eventRouter } from "./routers/event";
import { researcherRouter } from "./routers/researcher";
import { partnershipRouter } from "./routers/partnership";
import { organizationRouter } from "./routers/organization";
import { paperSubmissionRouter } from "./routers/paperSubmission";
import { mediaRouter } from "./routers/media";
import { testimonialRouter } from "./routers/testimonial";
import { adminRouter } from "./routers/admin";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  contact: contactRouter,
  subscriber: subscriberRouter,
  researchArticle: researchArticleRouter,
  news: newsRouter,
  event: eventRouter,
  researcher: researcherRouter,
  partnership: partnershipRouter,
  organization: organizationRouter,
  paperSubmission: paperSubmissionRouter,
  media: mediaRouter,
  testimonial: testimonialRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
