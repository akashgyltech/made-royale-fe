"use client";
import { useCmsBranding } from '@/hooks/use-cms-branding';
export default function SiteLogo({ variant, className, alt = 'Shizenta', children }) {
    const branding = useCmsBranding();
    const src = variant === 'dark' ? branding.logoDark : branding.logoLight;
    if (!src)
        return <>{children}</>;
    return <img src={src} alt={alt} className={className}/>;
}
