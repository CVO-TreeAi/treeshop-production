import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import ServiceTiles from '@/components/ServiceTiles'
import ValueProps from '@/components/ValueProps'
import ProjectGallery from '@/components/ProjectGallery'
import VideoHighlightsDynamic from '@/components/VideoHighlightsDynamic'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import GbpReviewHighlights from '@/components/GbpReviewHighlights'
import BlogHighlightsDynamic from '@/components/BlogHighlightsDynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Hero />
      <ValueProps />
      <ServiceTiles />
      <ProjectGallery />
      <VideoHighlightsDynamic />
      <GbpReviewHighlights 
        rating={4.9} 
        total={150} 
        reviews={[
          {author_name:'Mike Johnson',rating:5,text:'Cleared 15 acres perfectly. Professional crew, transparent process, done on time.'},
          {author_name:'Sarah Williams',rating:5,text:'Transformed our overgrown property into usable land. Highly recommend!'},
          {author_name:'Tom Rodriguez',rating:5,text:'Best forestry mulching service in Central Florida. Quality work.'}
        ]} 
      />
      <BlogHighlightsDynamic />
      <CTASection />
      <Footer />
    </div>
  );
}
