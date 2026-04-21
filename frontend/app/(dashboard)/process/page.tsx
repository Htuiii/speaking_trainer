'use client';
import { useSearchParams } from 'next/navigation';
import { InterviewProcess } from '@/screen/InterviewProcess';
import { lightTheme } from '@/theme/colors';

export default function ProcessRoute() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'General';

  return (
    <InterviewProcess 
      colors={lightTheme}
      topicTitle={topic}
      s={{}}
    />
  );
}