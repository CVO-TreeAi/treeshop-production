export interface ProjectImage {
  id: string;
  filename: string;
  altText: string;
  title: string;
  description: string;
  keywords: string[];
  equipment: string;
  location: string;
  projectType: 'Land Clearing' | 'Tree Removal' | 'Mulching' | 'Equipment Testing';
  date?: Date;
}

export const projectImages: ProjectImage[] = [
  {
    id: 'cat-265-fueling',
    filename: 'cat-265-fueling-forestry-mulching.jpg',
    altText: 'Professional CAT 265 forestry mulcher being fueled for land clearing in Central Florida',
    title: 'CAT 265 Equipment Preparation',
    description: 'TreeShop professional equipment maintenance and preparation for land clearing operations',
    keywords: ['CAT equipment', 'forestry maintenance', 'equipment preparation'],
    equipment: 'CAT 265',
    location: 'Central Florida',
    projectType: 'Land Clearing',
    date: new Date('2024-06-15')
  },
  // Additional project images would be added here following the same structure
];