import { ProjectShowcase, type Project } from './ProjectShowcase'

// Test data to verify component structure
const testProjects: Project[] = [
  {
    id: '1',
    location: 'Test Location, FL',
    packageSize: 'Test Package',
    description: 'Test description for the project showcase component.',
    beforeImage: '/treeshop/images/test-before.jpg',
    afterImage: '/treeshop/images/test-after.jpg',
    acreage: '1.0 acres',
    timeframe: '1 day',
    ctaText: 'Test CTA',
    onCtaClick: () => console.log('Test CTA clicked')
  }
]

// Example usage demonstrating the component API
export function TestProjectShowcase() {
  return (
    <ProjectShowcase 
      projects={testProjects}
      title="Test Project Showcase"
      subtitle="Testing our reusable component"
      showCta={true}
      defaultProject={0}
      className="test-class"
    />
  )
}

// Component is ready for use!