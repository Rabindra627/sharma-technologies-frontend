import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BlogsSection from "@/components/BlogsSection";
// import Contact from "@/components/Contact2";
import Contact from "@/components/Contact";
import OurTeamPage from "@/components/OurTeams";
import TechTrack from "@/components/TechTrack";


export default function Home(){

return(
<>
<Navbar/>
<Hero/>
<Services/>
<Portfolio/>
<OurTeamPage/>
<TechTrack/>
<BlogsSection/>
<Contact/>
<Footer/>
</>

)
}