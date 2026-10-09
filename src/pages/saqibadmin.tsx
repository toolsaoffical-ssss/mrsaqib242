import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: 'https://earingwhteui.vercel.app/',
      permanent: false, // Temporary redirect, just in case you want to change it later
    },
  };
};

export default function SaqibAdminTrap() {
  // Yeh page kabhi show nahi hoga kyunke server direct 0-second redirect kar dega
  return null;
}
