import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { InviteURL } from '../config/config';

export default function InviteRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push(InviteURL);
  }, [router]);

  return null;
}
