import { ChatHomePage } from '@/components/ChatHomePage';
import { HomeSections } from '@/components/HomeSections';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getModels() {
  try {
    const res = await fetch(`${API}/api/v1/models?limit=50`, { cache: 'no-store' });
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const models = await getModels();
  return (
    <>
      <ChatHomePage />
      <HomeSections models={models} />
    </>
  );
}
