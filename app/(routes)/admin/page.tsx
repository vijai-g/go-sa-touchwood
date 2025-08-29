import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';

export default async function AdminPage() {
  const session = await auth();
  // Option A: send non-admins home
  if (!session || (session as any).role !== 'admin') redirect('/');

  // Option B (alternatively): 404 for non-admins
  // if (!session || (session as any).role !== 'admin') notFound();

  return <AdminDashboard />;
}
