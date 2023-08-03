export async function POST(request: Request) {
  const theme = await request.text();
  return new Response('', {
    status: 200,
    headers: {
      'Set-Cookie': `theme=${
        theme === 'dark' || theme === 'light' ? theme : 'light'
      };path=/`,
    },
  });
}
