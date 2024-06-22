import { useRouter } from 'next/router'
import { useEffect } from 'react'

const MyError = ({ asPath }) => {
  const router = useRouter()

  useEffect(() => {
    const query = asPath ? { from: asPath } : {};
    router.push({
      pathname: '/404',
      query: query
    });
  }, []);

  return null
}

MyError.getInitialProps = ({ req, asPath }) => {
  const currentPath = asPath || (req ? req.url : '');
  return { asPath: currentPath };
}

export default MyError
