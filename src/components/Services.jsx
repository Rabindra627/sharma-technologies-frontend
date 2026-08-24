"use client";

import { FaCode, FaMobileAlt, FaCloud, FaRobot, FaCheck, FaGift } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: <FaCode size={24} />,
    originalPrice: "$5,000",
    discountPrice: "$2,999",
    billingCycle: "one-time",
    badge: "Most Popular",
    exclusiveOffer: "Free 1-Year Premium Hosting & Domain",
    features: [
      "Custom 5-Page Modern Design",
      "CMS & SEO Optimization Built-in",
      "Rapid 2-Week Turnaround",
      "12 Months Maintenance Support",
    ],
    ctaText: "Get Started",
    theme: {
      badge: "bg-blue-50 text-blue-600 border-blue-200",
      iconBg: "bg-blue-500/10 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
      highlight: "border-blue-100 bg-blue-50/40",
    },
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    icon: <FaMobileAlt size={24} />,
    originalPrice: "$50,000",
    discountPrice: "$29,999",
    billingCycle: "starting at",
    badge: "Best Value MVP",
    exclusiveOffer: "Free iOS & Android Cross-Platform Build",
    features: [
      "Single Codebase (React Native / Flutter)",
      "Core UI/UX & Backend Integration",
      "Scalable Cloud Database Setup",
      "App Store & Play Store Publishing",
    ],
    ctaText: "Build MVP",
    theme: {
      badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
      highlight: "border-emerald-100 bg-emerald-50/40",
    },
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    icon: <FaCloud size={24} />,
    originalPrice: "$800",
    discountPrice: "$399",
    billingCycle: "/month",
    badge: "Cost Saver",
    exclusiveOffer: "$500 AWS/Azure Credits On Sign-up",
    features: [
      "Auto-scaling Cloud Architecture",
      "Daily Backups & Disaster Recovery",
      "Database Optimization & Tuning",
      "24/7 Monitoring & 99.9% Uptime SLA",
    ],
    ctaText: "Scale Infrastructure",
    theme: {
      badge: "bg-sky-50 text-sky-600 border-sky-200",
      iconBg: "bg-sky-500/10 text-sky-600",
      button: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20",
      highlight: "border-sky-100 bg-sky-50/40",
    },
  },
  {
    slug: "ai-systems",
    title: "AI Systems",
    icon: <FaRobot size={24} />,
    originalPrice: "$25,000",
    discountPrice: "$12,499",
    billingCycle: "starting at",
    badge: "Exclusive Launch",
    exclusiveOffer: "Free Custom Fine-Tuning & Prompt Audit",
    features: [
      "Custom RAG / LLM Integration",
      "Natural Language Processing Workflows",
      "Enterprise Data Privacy & Security",
      "3 Months Dedicated AI Support",
    ],
    ctaText: "Deploy AI",
    theme: {
      badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20",
      highlight: "border-indigo-100 bg-indigo-50/40",
    },
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
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
      className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            Transparent Pricing & Exclusive Bundles
          </span>
          <h2 className="text-3xl md:text-3xl font-extrabold mt-6 text-blue-400 tracking-tight">
            Designed for Growth, Priced for Value
          </h2>
          <p className="text-slate-500 mt-4 text-base md:text-lg">
            Choose the core tech stack your project needs. All plans include an exclusive initial setup perk.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={item}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="relative bg-white border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-slate-300 transition-all duration-300"
            >
              <div>
                {/* Top Badge & Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${service.theme.iconBg}`}>
                    {service.icon}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${service.theme.badge}`}>
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>

                {/* Price Display */}
                <div className="my-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900">{service.discountPrice}</span>
                    <span className="text-xs text-slate-500 font-medium">{service.billingCycle}</span>
                  </div>
                  <div className="text-xs text-slate-400 line-through mt-1">
                    Standard: {service.originalPrice}
                  </div>
                </div>

                {/* Exclusive Offer Box */}
                <div className={`mb-6 p-3.5 rounded-2xl border ${service.theme.highlight} flex items-start gap-3`}>
                  <FaGift className="text-blue-600 mt-0.5 shrink-0" size={15} />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Exclusive Offer</span>
                    <span className="text-xs text-slate-600 leading-snug">{service.exclusiveOffer}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                      <div className="p-0.5 bg-emerald-100 rounded-full text-emerald-600">
                        <FaCheck size={10} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link href={`/services/${service.slug}`} className="w-full">
                <button className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all duration-200 shadow-md ${service.theme.button}`}>
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