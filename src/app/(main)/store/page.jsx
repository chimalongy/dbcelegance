'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home'); // Ensure the route exists
  }, []);

  return <div>Redirecting...</div>;
}

export default Page;

