"use client";

import { FaCode, FaMobileAlt, FaCloud, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

import Link from "next/link";

export default function Services() {

const services = [
{
    slug:"web-development",
    title: "Web Development",
    icon: <FaCode size={40}/>    
},
{
    slug:"mobile-apps",
    title: "Mobile Apps",
    icon: <FaMobileAlt size={40}/>    
},
{
    slug:"cloud-solutions",
    title: "Cloud Solutions",
    icon: <FaCloud size={40}/>    
},
{
    slug:"ai-systems",
    title: "AI Systems",    
    icon: <FaRobot size={40}/>
}
];

const container = {
hidden: {},
show: {
transition: {
staggerChildren: 0.2
}
}
};

const item = {
hidden: { opacity: 0, y: 80 },
show: { opacity: 1, y: 0 }
};

return (

<motion.section id="services"
initial="hidden"
whileInView="show"
viewport={{ once: true }}
variants={container}
className="py-24 bg-gray-100"
>

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-4xl font-bold text-center">
Our Services
</h2>

<p className="text-center text-gray-500 mt-4">
We deliver cutting-edge technology solutions
</p>

<div className="grid md:grid-cols-4 gap-10 mt-16">

{services.map((service,index)=>(
<Link key={service.title} href={`/services/${service.slug}`}>
<motion.div
key={index}
variants={item}
transition={{ duration: 0.6 }}

whileHover={{
scale: 1.07,
rotateX: 5,
rotateY: 5
}}

className="bg-white p-10 rounded-2xl shadow-md text-center relative hover:shadow-2xl transition duration-300 cursor-pointer"
>
    

{/* glow background */}
<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 hover:opacity-10 rounded-2xl transition"></div>

{/* icon animation */}
<motion.div
animate={{ y: [0,-10,0] }}
transition={{
duration: 2,
repeat: Infinity
}}
className="text-blue-600 mb-6 flex justify-center"
>
{service.icon}
</motion.div>

<h3 className="text-xl font-semibold">
{service.title}
</h3>
</motion.div>
</Link>
))}

</div>

</div>

</motion.section>

)
}