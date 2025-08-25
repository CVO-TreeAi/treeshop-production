import Image from 'next/image';
import Link from 'next/link';

interface FeconLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  noLink?: boolean;
}

export default function FeconLogo({ className = '', size = 'md', noLink = false }: FeconLogoProps) {
  const sizeClasses = {
    sm: 'h-4 w-auto',
    md: 'h-6 w-auto', 
    lg: 'h-8 w-auto'
  };

  const logoImage = (
    <Image
      src="/images/fecon-logo-white.png"
      alt="Fecon"
      width={120}
      height={40}
      className={`${sizeClasses[size]} object-contain`}
      style={{ filter: 'brightness(1.1)' }}
    />
  );

  if (noLink) {
    return <span className={`inline-block ${className}`}>{logoImage}</span>;
  }

  return (
    <Link
      href="https://fecon.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block hover:opacity-80 transition-opacity duration-200 ${className}`}
      aria-label="Fecon Equipment - External Link"
    >
      {logoImage}
    </Link>
  );
}