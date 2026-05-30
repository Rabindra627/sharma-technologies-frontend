import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";

// ✅ Move data outside component (cleaner)
const services = [
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "Web development is the process of building and maintaining websites and web applications. It includes everything from creating simple static pages to complex systems like e-commerce platforms, social networks, and enterprise solutions. In today’s digital world, having a strong online presence is essential for businesses and individuals alike. A well-designed website not only attracts users but also builds trust and drives growth.",
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    description: "We build high-performance mobile applications for Android and iOS platforms.",
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment solutions for modern businesses.",
  },
  {
    slug: "ai-systems",
    title: "AI Systems",
    description: "AI-powered systems including automation, analytics, and smart applications.",
  },
];

export default async function ServicesDetails({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) return notFound();

  return (
    <>
      <Navbar />
      <br/><br/><br/>
      <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-12">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {service.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-lg">
            {service.description || "Details coming soon..."}
          </p>

        </div>
      </div>

      <Footer />
    </>
  );
}