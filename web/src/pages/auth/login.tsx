import { withCSRF } from '@/shared/middlewares';

export default function Login({ csrf }: { csrf: string }) {
  return <div>{csrf}</div>;
}

export const getServerSideProps = withCSRF();
