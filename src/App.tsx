import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@/components/layout/container';
import { Header, HeaderContent } from '@/components/layout/header';
import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ComponentShowcase } from '@/pages/ComponentShowcase';
import { DailyNotes } from '@/pages/DailyNotes';
import { useThemeStore } from '@/stores/theme-store';
import { QueryProvider } from './providers/query-provider';

// Clean background component
const Background = () => <div className="fixed inset-0 -z-10 bg-base" />;

function AppContent() {
  const [view, setView] = useState<'home' | 'notes' | 'components'>('notes');

  // Initialize theme system
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  if (view === 'notes') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <DailyNotes />
      </div>
    );
  }

  if (view === 'components') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
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
      <Background />
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={
            <div className="min-h-screen relative overflow-hidden">
              <Background />
              <DailyNotes />
            </div>
          } />
          <Route path="/notes/:date" element={
            <div className="min-h-screen relative overflow-hidden">
              <Background />
              <DailyNotes />
            </div>
          } />
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="/home" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
