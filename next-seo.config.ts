import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | Tree Shop',
  defaultTitle: 'Tree Shop — Forestry Mulching & Stump Grinding',
  description:
    'Forestry mulching and stump grinding in Florida. Transparent pricing, fast estimates, expert results.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Tree Shop',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};

export default config;
