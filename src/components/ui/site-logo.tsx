"use client";
import { useCmsBranding } from '@/hooks/use-cms-branding';

type Props = {
  variant: 'dark' | 'light';
  className?: string;
  alt?: string;
  children: React.ReactNode;
};

export default function SiteLogo({ variant, className, alt = 'Shizenta', children }: Props) {
  const branding = useCmsBranding();
  const src = variant === 'dark' ? branding.logoDark : branding.logoLight;

  if (!src) return <>{children}</>;
  return <img src={src} alt={alt} className={className} />;
}
