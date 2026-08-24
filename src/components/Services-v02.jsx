"use client";

import { FaCode, FaMobileAlt, FaCloud, FaRobot, FaCheckCircle, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: <FaCode size={32} />,
    originalPrice: "$5,000",
    discountPrice: "$2,999",
    billingCycle: "one-time",
    badge: "Most Popular",
    exclusiveOffer: "Free 1-Year Hosting & Domain Included",
    features: [
      "5-Page Responsive Design",
      "CMS & SEO Optimization",
      "Fast 2-Week Delivery",
      "Basic Maintenance Support",
    ],
    ctaText: "Get Started",
    accentColor: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    icon: <FaMobileAlt size={32} />,
    originalPrice: "$50,000",
    discountPrice: "$29,999",
    billingCycle: "starting at",
    badge: "Exclusive Package",
    exclusiveOffer: "Free iOS & Android Cross-Platform Build",
    features: [
      "Single Codebase (React Native/Flutter)",
      "Core Feature Integration",
      "Cloud Database Setup",
      "App Store & Play Store Publishing",
    ],
    ctaText: "Build MVP",
    accentColor: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    icon: <FaCloud size={32} />,
    originalPrice: "$800",
    discountPrice: "$399",
    billingCycle: "/month",
    badge: "Cost Saver",
    exclusiveOffer: "$500 AWS/Azure Credits On Sign-up",
    features: [
      "Scalable Infrastructure Config",
      "Automated Daily Backups",
      "Database Optimization",
      "24/7 Monitoring & 99.9% Uptime",
    ],
    ctaText: "Scale Now",
    accentColor: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/30",
  },
  {
    slug: "ai-systems",
    title: "AI Systems",
    icon: <FaRobot size={32} />,
    originalPrice: "$25,000",
    discountPrice: "$12,499",
    billingCycle: "starting at",
    badge: "Limited Offer",
    exclusiveOffer: "Free Custom Fine-Tuning & Prompt Audit",
    features: [
      "Custom RAG / LLM Integration",
      "Natural Language Processing",
      "Enterprise Data Security",
      "3 Months Dedicated Support",
    ],
    ctaText: "Deploy AI",
    accentColor: "from-purple-500 to-indigo-500",
    borderColor: "border-purple-500/30",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export default function Services() {
  return (
    <motion.section
      id="services"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
      className="py-20 md:py-28 bg-slate-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
            Limited-Time Special Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            High-Impact Tech, Cost-Effective Plans
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Choose a plan tailored to your scale. Every tier includes an exclusive launch offer.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={item}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative bg-slate-900/90 border ${service.borderColor} rounded-3xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-blue-400/50`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${service.accentColor} text-white`}>
                    {service.badge}
                  </span>
                </div>

                {/* Service Title & Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl bg-slate-800 text-white`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                </div>

                {/* Cost Effective Pricing Display */}
                <div className="my-6 border-y border-slate-800 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{service.discountPrice}</span>
                    <span className="text-xs text-slate-400">{service.billingCycle}</span>
                  </div>
                  <div className="text-xs text-slate-500 line-through mt-1">
                    Regular: {service.originalPrice}
                  </div>
                </div>

                {/* Exclusive Offer Box */}
                <div className="mb-6 p-3 rounded-xl bg-blue-950/50 border border-blue-500/30 flex items-start gap-2">
                  <FaTag className="text-blue-400 mt-1 shrink-0" size={14} />
                  <div>
                    <p className="text-xs font-semibold text-blue-300">Exclusive Offer:</p>
                    <p className="text-xs text-slate-300 font-medium">{service.exclusiveOffer}</p>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <FaCheckCircle className="text-emerald-400 shrink-0" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link href={`/services/${service.slug}`} className="w-full">
                <button className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r ${service.accentColor} hover:opacity-90 text-white shadow-lg`}>
                  {service.ctaText}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}