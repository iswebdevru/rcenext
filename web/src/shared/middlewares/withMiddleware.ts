import { GetServerSideProps } from 'next';

export default function withMiddleware(middleware: GetServerSideProps) {
  return (userGetServerSideProps?: GetServerSideProps) => {
    const end: GetServerSideProps = async ctx => {
      const middlewareResult = await middleware(ctx);
      if (!userGetServerSideProps) {
        return middlewareResult;
      }
      if ('notFound' in middlewareResult || 'redirect' in middlewareResult) {
        return middlewareResult;
      }
      const userResult = await userGetServerSideProps(ctx);
      if ('notFound' in userResult || 'redirect' in userResult) {
        return userResult;
      }
      const middlewareProps = await middlewareResult.props;
      const userProps = await userResult.props;
      return {
        props: {
          ...middlewareProps,
          ...userProps,
        },
      };
    };
    return end;
  };
}
