import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import ValueProps from '@/components/ValueProps'
import ProjectGallery from '@/components/ProjectGallery'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Hero />
      <ValueProps />
      <ProjectGallery />
      <section id="estimate" className="py-16 px-4">
        <LeadCaptureForm />
      </section>
      <Footer />
    </div>
  );
}
