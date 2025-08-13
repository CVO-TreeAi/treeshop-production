export type City = {
  slug: string;
  name: string;
  corridor: 'I-4' | 'I-95' | 'Ocala & Nature Coast';
  county?: string;
  state: 'FL';
};

export const cities: City[] = [
  // I-4 Corridor
  { slug: 'tampa', name: 'Tampa', corridor: 'I-4', state: 'FL' },
  { slug: 'plant-city', name: 'Plant City', corridor: 'I-4', state: 'FL' },
  { slug: 'lakeland', name: 'Lakeland', corridor: 'I-4', state: 'FL' },
  { slug: 'winter-haven', name: 'Winter Haven', corridor: 'I-4', state: 'FL' },
  { slug: 'orlando', name: 'Orlando', corridor: 'I-4', state: 'FL' },
  { slug: 'kissimmee', name: 'Kissimmee', corridor: 'I-4', state: 'FL' },
  { slug: 'altamonte-springs', name: 'Altamonte Springs', corridor: 'I-4', state: 'FL' },
  { slug: 'daytona-beach', name: 'Daytona Beach', corridor: 'I-4', state: 'FL' },

  // I-95 Corridor (North → South)
  { slug: 'jacksonville', name: 'Jacksonville', corridor: 'I-95', state: 'FL' },
  { slug: 'st-augustine', name: 'St. Augustine', corridor: 'I-95', state: 'FL' },
  { slug: 'palm-coast', name: 'Palm Coast', corridor: 'I-95', state: 'FL' },
  { slug: 'ormond-beach', name: 'Ormond Beach', corridor: 'I-95', state: 'FL' },
  { slug: 'daytona-beach-i95', name: 'Daytona Beach', corridor: 'I-95', state: 'FL' },
  { slug: 'new-smyrna-beach', name: 'New Smyrna Beach', corridor: 'I-95', state: 'FL' },
  { slug: 'titusville', name: 'Titusville', corridor: 'I-95', state: 'FL' },
  { slug: 'cocoa', name: 'Cocoa', corridor: 'I-95', state: 'FL' },
  { slug: 'melbourne', name: 'Melbourne', corridor: 'I-95', state: 'FL' },
  { slug: 'palm-bay', name: 'Palm Bay', corridor: 'I-95', state: 'FL' },
  { slug: 'vero-beach', name: 'Vero Beach', corridor: 'I-95', state: 'FL' },
  { slug: 'fort-pierce', name: 'Fort Pierce', corridor: 'I-95', state: 'FL' },
  { slug: 'port-st-lucie', name: 'Port St. Lucie', corridor: 'I-95', state: 'FL' },
  { slug: 'west-palm-beach', name: 'West Palm Beach', corridor: 'I-95', state: 'FL' },
  { slug: 'boca-raton', name: 'Boca Raton', corridor: 'I-95', state: 'FL' },
  { slug: 'fort-lauderdale', name: 'Fort Lauderdale', corridor: 'I-95', state: 'FL' },
  { slug: 'miami', name: 'Miami', corridor: 'I-95', state: 'FL' },

  // Ocala & Nature Coast (East ↔ West)
  { slug: 'ocala', name: 'Ocala', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'silver-springs', name: 'Silver Springs', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'dunnellon', name: 'Dunnellon', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'crystal-river', name: 'Crystal River', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'inverness', name: 'Inverness', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'her-nando', name: 'Hernando', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'lecanto', name: 'Lecanto', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'brooksville', name: 'Brooksville', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'spring-hill', name: 'Spring Hill', corridor: 'Ocala & Nature Coast', state: 'FL' },
  { slug: 'homosassa', name: 'Homosassa', corridor: 'Ocala & Nature Coast', state: 'FL' },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}


