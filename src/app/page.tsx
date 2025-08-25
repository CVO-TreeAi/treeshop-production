import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import ValueProps from '@/components/ValueProps'
import ProjectGallery from '@/components/ProjectGallery'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Hero />
      <ValueProps />
      <ProjectGallery />
      <Footer />
    </div>
  );
}
