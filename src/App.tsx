import { useState, useEffect } from 'react';
import { QueryProvider } from './providers/query-provider';
import { useThemeStore } from '@/stores/theme-store';
import { Header, HeaderContent } from '@/components/layout/header';
import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ComponentShowcase } from '@/pages/ComponentShowcase';
import { DailyNotes } from '@/pages/DailyNotes';

function AppContent() {
  const [view, setView] = useState<'home' | 'notes' | 'components'>('notes');
  
  // Initialize theme system
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  // Shared background component
  const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient - charcoal theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-gray-800 dark:to-slate-900" />
      
      {/* Animated blobs - muted charcoal colors */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-300 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-15 animate-blob" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-yellow-300 dark:bg-amber-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-12 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-indigo-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-13 animate-blob animation-delay-6000" />
      
      {/* Additional charcoal depth layer */}
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-slate-900/40 dark:via-transparent dark:to-slate-800/20" />
      
      {/* Glass overlay - warmer for charcoal */}
      <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl" />
    </div>
  );

  if (view === 'notes') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <DailyNotes />
      </div>
    );
  }

  if (view === 'components') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <Header>
          <HeaderContent>
            <Text size="xl" weight="semibold">Component Showcase</Text>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setView('notes')}>
                Daily Notes
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setView('home')}>
                Home
              </Button>
            </div>
          </HeaderContent>
        </Header>
        <ComponentShowcase />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Header>
        <HeaderContent>
          <Text size="xl" weight="semibold">Legendary</Text>
          <Button size="sm" variant="ghost" onClick={() => setView('notes')}>
            Daily Notes
          </Button>
        </HeaderContent>
      </Header>
      
      <main className="py-8">
        <Container>
          <Stack gap={8}>
            <Stack gap={2} className="animate-fade-up">
              <Text as="h1" size="3xl" weight="bold">
                Welcome to Legendary
              </Text>
              <Text className="text-text-muted">
                A sophisticated foundation for your next masterpiece.
              </Text>
            </Stack>
            
            <Stack direction="row" gap={4}>
              <Button onClick={() => setView('notes')}>Start Writing</Button>
              <Button variant="secondary" onClick={() => setView('components')}>
                View Components
              </Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}

export default App;