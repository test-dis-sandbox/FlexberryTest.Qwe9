import Layout from '@/layout';
import { PublicEnv } from '@/utils/envUtils';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <PublicEnv />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
