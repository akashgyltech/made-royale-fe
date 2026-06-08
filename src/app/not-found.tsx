import { Metadata } from 'next';
import ErrorMain from '@/pages/error/error-main'
 
export const metadata: Metadata = {
  title: "Shizenta - Not Found Page",
};

export default function NotFound() {
  return (
    <ErrorMain/>
  )
}