import { Metadata } from 'next';
import ErrorMain from '@/pages/error/error-main'
 
export const metadata: Metadata = {
  title: "Page Not Found — Shizenta",
};

export default function NotFound() {
  return (
    <ErrorMain/>
  )
}