import type { Metadata } from 'next';
import { getCityBySlug } from '../cities';

type Props = { params: { city: string } };

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) {
    return { title: 'Florida Forestry Mulching | The Tree Shop' };
  }
  const title = `Forestry Mulching in ${city.name}, Florida | The Tree Shop`;
  const description = `Forestry mulching and land clearing in ${city.name}, FL. Selective DBH packages, eco‑friendly mulch finish, fast scheduling along the ${city.corridor}.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.fltreeshop.com/locations/${city.slug}` },
    openGraph: { title, description },
  };
}

export default function Head(){
  return null;
}


