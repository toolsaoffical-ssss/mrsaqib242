import dynamic from 'next/dynamic';

const App = dynamic(() => import('../ClientApp'), {
  loading: () => (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-white">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return <App />;
}

