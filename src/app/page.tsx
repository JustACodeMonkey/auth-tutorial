import { Roboto_Condensed } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/auth/loggin-button';

const roboto = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['600']
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-sky-500">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", roboto.className)}>Auth</h1>
        <p className="text-white text-lg">
          A simple authentication service
        </p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">Sign in</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
