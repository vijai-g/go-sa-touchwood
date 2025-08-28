'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (!session || session.user.role !== 'admin') return <p>Redirecting...</p>;

  return <div><h2 className="text-2xl font-bold">Admin Dashboard</h2><p>Manage products here.</p></div>;
}