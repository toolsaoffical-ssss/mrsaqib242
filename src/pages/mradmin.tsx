import { GetServerSideProps } from 'next';
import AdminPageView from '../components/AdminPageView';
import { supabaseAdmin } from '../lib/supabaseServer';

export default function MrAdminPage() {
  return <AdminPageView />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ip = (context.req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || context.req.socket.remoteAddress || 'unknown';
  
  if (ip !== 'unknown') {
    const { data } = await supabaseAdmin
      .from('admin_banned_ips')
      .select('banned_until')
      .eq('ip_address', ip)
      .maybeSingle();

    if (data && new Date(data.banned_until) > new Date()) {
      return {
        redirect: {
          destination: '/yourareadmin?reason=banned_24h',
          permanent: false,
        }
      };
    }
  }

  return { props: {} };
};
