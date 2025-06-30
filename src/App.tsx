import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/container';
import { Header, HeaderContent } from '@/components/layout/header';
import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ComponentShowcase } from '@/pages/ComponentShowcase';
import { DailyNotes } from '@/pages/DailyNotes';
import { useThemeStore } from '@/stores/theme-store';
import { QueryProvider } from './providers/query-provider';

function AppContent() {
  const [view, setView] = useState<'home' | 'notes' | 'components'>('notes');

  // Initialize theme system
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  // Simplified background component for performance
  const AnimatedBackground = () => (
    <div className="fixed inset-0 -z-10">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-gray-900" />
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
            <Text size="xl" weight="semibold">
              Component Showcase
            </Text>
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
          <Text size="xl" weight="semibold">
            Legendary
          </Text>
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
