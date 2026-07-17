import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import AuthLayout from "@/components/AuthLayout";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Research = lazy(() => import("@/pages/Research"));
const ResearchDetail = lazy(() => import("@/pages/ResearchDetail"));
const News = lazy(() => import("@/pages/News"));
const NewsDetail = lazy(() => import("@/pages/NewsDetail"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const Network = lazy(() => import("@/pages/Network"));
const OrganizationDetail = lazy(() => import("@/pages/OrganizationDetail"));
const Partnerships = lazy(() => import("@/pages/Partnerships"));
const PaperSubmission = lazy(() => import("@/pages/PaperSubmission"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const CompleteRegistration = lazy(() => import("@/pages/CompleteRegistration"));
const Account = lazy(() => import("@/pages/Account"));
const Privacy = lazy(() => import("@/pages/legal/Privacy"));
const Terms = lazy(() => import("@/pages/legal/Terms"));
const Cookies = lazy(() => import("@/pages/legal/Cookies"));
const Accessibility = lazy(() => import("@/pages/legal/Accessibility"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Overview = lazy(() => import("@/pages/admin/Overview"));
const ResearchArticlesAdmin = lazy(() => import("@/pages/admin/ResearchArticles"));
const NewsAdmin = lazy(() => import("@/pages/admin/NewsAdmin"));
const EventsAdmin = lazy(() => import("@/pages/admin/EventsAdmin"));
const Submissions = lazy(() => import("@/pages/admin/Submissions"));
const RecognitionRequests = lazy(() => import("@/pages/admin/RecognitionRequests"));
const Organizations = lazy(() => import("@/pages/admin/Organizations"));
const Contacts = lazy(() => import("@/pages/admin/Contacts"));
const UsersAdmin = lazy(() => import("@/pages/admin/UsersAdmin"));
const Media = lazy(() => import("@/pages/admin/Media"));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
      <div className="w-6 h-6 border-2 border-[#c25e44] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    sessionStorage.removeItem("ibai_chunk_reload_attempted");
  }, []);

  return (
    <>
      <ScrollToTop />
      <ChunkErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/:slug" element={<ResearchDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/network" element={<Network />} />
            <Route path="/network/:slug" element={<OrganizationDetail />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/paper-submission" element={<PaperSubmission />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/complete" element={<CompleteRegistration />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/dashboard" element={<AuthLayout><Overview /></AuthLayout>} />
          <Route path="/dashboard/research" element={<AuthLayout><ResearchArticlesAdmin /></AuthLayout>} />
          <Route path="/dashboard/news" element={<AuthLayout><NewsAdmin /></AuthLayout>} />
          <Route path="/dashboard/events" element={<AuthLayout><EventsAdmin /></AuthLayout>} />
          <Route path="/dashboard/submissions" element={<AuthLayout><Submissions /></AuthLayout>} />
          <Route path="/dashboard/recognition" element={<AuthLayout><RecognitionRequests /></AuthLayout>} />
          <Route path="/dashboard/organizations" element={<AuthLayout><Organizations /></AuthLayout>} />
          <Route path="/dashboard/contacts" element={<AuthLayout><Contacts /></AuthLayout>} />
          <Route path="/dashboard/users" element={<AuthLayout><UsersAdmin /></AuthLayout>} />
          <Route path="/dashboard/media" element={<AuthLayout><Media /></AuthLayout>} />
        </Routes>
      </Suspense>
      </ChunkErrorBoundary>
      <Toaster position="bottom-right" />
    </>
  );
}
