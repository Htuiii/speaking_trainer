'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { MicCheckScreen } from '@/screen/MicCheckScreen';
import { lightTheme } from '@/theme/colors';

export default function MicCheckRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'General';

  return (
    <MicCheckScreen 
      colors={lightTheme}
      selectedTopicTitle={topic}
      onBack={() => router.push('/')}
      onSuccess={() => router.push(`/process?topic=${encodeURIComponent(topic)}`)}
      onSelectTopic={(title) => router.push(`?topic=${encodeURIComponent(title)}`)}
      s={{}}
    />
  );
}