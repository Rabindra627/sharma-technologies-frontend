import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Code2, Smartphone, Cloud, BrainCircuit, 
  Layers, Cpu, ShieldCheck, Zap,
  CheckCircle2, ArrowLeft, Terminal, Compass
} from "lucide-react";

// Robust dataset to feed the dynamic rich-ui layout
const servicesData = {
  "web-development": {
    title: "Web Development",
    icon: Code2,
    tagline: "High-Performance Next-Gen Web Solutions",
    longDescription: "Web development is the process of building and maintaining websites and web applications. It includes everything from creating simple static pages to complex systems like e-commerce platforms, social networks, and enterprise solutions. In today’s digital world, having a strong online presence is essential for businesses and individuals alike. A well-designed website not only attracts users but also builds trust and drives growth.",
    features: [
      { title: "Custom Architecture", desc: "Tailored frontend & backend systems built using bleeding-edge frameworks." },
      { title: "E-Commerce Systems", desc: "Highly secure, performant checkouts coupled with flexible catalog management." },
      { title: "Enterprise Grade Portal", desc: "Robust data panels, advanced analytics, and custom user role management workflows." },
      { title: "SEO & Core Web Vitals Optimization", desc: "Blazing fast interaction speeds yielding index positioning on search engines." }
    ],
    techStack: ["React / Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "GraphQL", "TypeScript"],
    workflow: ["Discovery & Scope", "UI/UX High-Fidelity Wireframes", "Agile Component Engineering", "Automated QA & Launch"]
  },
  "mobile-apps": {
    title: "Mobile App Development",
    icon: Smartphone,
    tagline: "Native & Cross-Platform Mobile Excellence",
    longDescription: "We build high-performance mobile applications for Android and iOS platforms. By utilizing standard rendering runtimes and native hardware bridges, we ensure fluid transitions, immediate system processing speeds, and a stunning presentation across form factors.",
    features: [
      { title: "Cross-Platform Frameworks", desc: "Write once, deploy seamlessly across iOS and Android systems using React Native." },
      { title: "Native API Bridges", desc: "Direct optimization access for biocaching, file systems, camera APIs, and core features." },
      { title: "Offline Synchronization", desc: "Local data hydration systems that automatically sync once internet access stabilizes." },
      { title: "App Store Lifecycle Management", desc: "Full submission coverage ensuring seamless compliance reviews with Apple and Google stores." }
    ],
    techStack: ["React Native", "Flutter", "Swift / Kotlin", "Firebase", "Redux Toolkit", "Node.js"],
    workflow: ["Mobile Wireframing", "Asset Optimization", "Native Build Cycles", "Beta Flight Distribution"]
  },
  "cloud-solutions": {
    title: "Cloud Infrastructure",
    icon: Cloud,
    tagline: "Scalable and High Availability Cloud Systems",
    longDescription: "Scalable cloud infrastructure and deployment solutions for modern businesses. We design resilient network grids capable of managing concurrent system request surges automatically while scaling down resource costs during off-peak windows.",
    features: [
      { title: "Infrastructure as Code", desc: "Repeatable, automated cloud grid deployments mapped entirely via configuration layers." },
      { title: "Containerization Grids", desc: "Isolated microservice deployments managed cleanly through Docker clusters." },
      { title: "CI/CD Deployment Pipelines", desc: "Zero-downtime integration loops pushing updates instantly upon automated checkouts." },
      { title: "Serverless Optimization", desc: "Event-driven runtime setups trimming hosting costs to zero when idle." }
    ],
    techStack: ["AWS Cloud", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Redis Caching"],
    workflow: ["Infrastructure Audit", "Schema Map Design", "Pipeline Provisioning", "Stress Load Testing"]
  },
  "ai-systems": {
    title: "AI & Smart Automation",
    icon: BrainCircuit,
    tagline: "Intelligent Systems Powered by Modern Automation",
    longDescription: "AI-powered systems including automation, analytics, and smart applications. We integrate intelligent logic directly into standard production workflows, allowing businesses to extract automated patterns, generate insights, and simplify tasks.",
    features: [
      { title: "Predictive Behavior Systems", desc: "Analyze historical timelines to predict market trends and inventory flows accurately." },
      { title: "Large Language Integration", desc: "Contextual assistant loops designed to interact natively with internal documentation." },
      { title: "Computer Vision Platforms", desc: "High-speed automated image filtering, tagging, and contextual recognition algorithms." },
      { title: "Intelligent ETL Pipelines", desc: "Extract unstructured application data and format it into clean dashboards automatically." }
    ],
    techStack: ["Python / PyTorch", "OpenAI API", "LangChain", "FastAPI", "Vector DBs (Pinecone)", "Pandas"],
    workflow: ["Dataset Collection", "Model Weight Tuning", "API Gateway Integration", "Bias Evaluation"]
  }
};

export default async function ServicesDetails({ params }) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) return notFound();

  const IconComponent = service.icon;

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-slate-50/60 text-slate-800">
        
        {/* Dynamic Service Hero Banner */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-28 pb-20 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Decorative Background Contours */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Breadcrumb Navigation Control */}
            <Link 
              href="/#services" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-100 hover:text-white font-medium mb-6 group transition-colors outline-none"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back to Services
            </Link>

            {/* Banner Main Grid */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 uppercase tracking-wider">
                  Our Expertise
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {service.title}
                </h1>
                <p className="text-base sm:text-lg text-blue-100 font-medium tracking-wide">
                  {service.tagline}
                </p>
              </div>

              {/* Float Decorative Service Rounded Icon Block */}
              <div className="hidden md:flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl shrink-0 self-center">
                <IconComponent size={40} className="stroke-[1.5]" />
              </div>
            </div>
          </div>

          {/* Seamless Wave Divider Base */}
          <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none translate-y-[2px]">
            <svg viewBox="0 0 1440 60" className="w-full h-auto min-h-[20px]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f8fafc" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,60L1320,60C1200,60,960,60,720,60C480,60,240,60,120,60L0,60Z" />
            </svg>
          </div>
        </section>

        {/* Core Layout Main Section Container */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 -mt-8 sm:-mt-12 lg:-mt-16 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Area: Long Description & Core Feature Matrix */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Detailed Overview Module */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Compass size={18} className="text-blue-600" /> Service Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify">
                  {service.longDescription}
                </p>
              </div>

              {/* Feature Value Matrix Cards Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 px-1 flex items-center gap-2">
                  <Layers size={18} className="text-blue-600" /> Key Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{feat.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Sticky Sidebar Column: Tech Stack & Operational Pipeline */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Technical Stack Component Badge Nesting Container */}
              <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Terminal size={16} className="text-blue-600" /> Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Delivery Operational Step Tracker */}
              <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Cpu size={16} className="text-blue-600" /> Execution Process
                </h3>
                <ol className="space-y-4">
                  {service.workflow.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-3 group">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white font-bold text-xs shrink-0 transition-colors">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Immediate Contextual CTA Interaction Anchor Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <Zap size={120} />
                </div>
                <h3 className="text-base font-bold mb-1.5 relative z-10">Have a Project in Mind?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10">
                  Let’s collaborate to build reliable, high-performance solutions custom-tailored to handle your enterprise objectives.
                </p>
                <Link 
                  href="/#contact"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98] outline-none text-center relative z-10"
                >
                  Initiate Consult
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}