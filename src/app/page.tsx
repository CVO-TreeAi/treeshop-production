import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import ValueProps from '@/components/ValueProps'
import ProjectGalleryDynamic from '@/components/ProjectGalleryDynamic'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Hero />
      <ValueProps />
      <ProjectGalleryDynamic />
      <Footer />
    </div>
  );
}
