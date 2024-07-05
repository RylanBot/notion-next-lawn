import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MyError = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/404');
  }, []);

  return null;
};

export default MyError;
