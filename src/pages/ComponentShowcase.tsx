import { useState } from 'react';
import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { List, ListContent, ListHeader, ListItem } from '@/components/ui/list';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

export function ComponentShowcase() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [progress, setProgress] = useState(60);

  return (
    <Container size="lg" className="py-12">
      <Stack gap={12}>
        <Stack gap={2}>
          <Text as="h1" size="3xl" weight="bold">
            Component Showcase
          </Text>
          <Text className="text-text-muted">
            A comprehensive display of our design system components
          </Text>
        </Stack>

        <Stack gap={8}>
          <Card className="mb-8">
            <CardHeader>
              <Text as="h2" size="2xl" weight="bold">
                Minimal Glass Design System
              </Text>
            </CardHeader>
            <CardContent>
              <Text className="text-text-muted">
                A clean, minimal approach to glassmorphism. Every element uses subtle transparency
                and blur effects to create depth while maintaining clarity and readability.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Text as="h2" size="xl" weight="semibold">
                Buttons
              </Text>
            </CardHeader>
            <CardContent>
              <Stack direction="row" gap={4} wrap>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Text as="h2" size="xl" weight="semibold">
                Form Elements
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap={6}>
                <Stack gap={2}>
                  <Label htmlFor="input">Input</Label>
                  <Input id="input" placeholder="Enter text..." />
                </Stack>

                <Stack gap={2}>
                  <Label htmlFor="textarea">Textarea</Label>
                  <Textarea id="textarea" placeholder="Enter longer text..." />
                </Stack>

                <Stack direction="row" gap={4} align="center">
                  <Checkbox
                    id="checkbox"
                    checked={checkboxChecked}
                    onCheckedChange={(checked) => setCheckboxChecked(!!checked)}
                  />
                  <Label htmlFor="checkbox">Accept terms and conditions</Label>
                </Stack>

                <Stack gap={2}>
                  <Label>Radio Group</Label>
                  <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    <Stack gap={2}>
                      <Stack direction="row" gap={2} align="center">
                        <RadioGroupItem value="option1" id="r1" />
                        <Label htmlFor="r1">Option 1</Label>
                      </Stack>
                      <Stack direction="row" gap={2} align="center">
                        <RadioGroupItem value="option2" id="r2" />
                        <Label htmlFor="r2">Option 2</Label>
                      </Stack>
                    </Stack>
                  </RadioGroup>
                </Stack>

                <Stack direction="row" gap={4} align="center">
                  <Switch id="switch" checked={switchChecked} onCheckedChange={setSwitchChecked} />
                  <Label htmlFor="switch">Enable notifications</Label>
                </Stack>

                <Stack gap={2}>
                  <Label>Select</Label>
                  <Select value={selectValue} onValueChange={setSelectValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Text as="h2" size="xl" weight="semibold">
                Tabs
              </Text>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <Text>Content for tab 1</Text>
                </TabsContent>
                <TabsContent value="tab2">
                  <Text>Content for tab 2</Text>
                </TabsContent>
                <TabsContent value="tab3">
                  <Text>Content for tab 3</Text>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Text as="h2" size="xl" weight="semibold">
                Data Display
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap={6}>
                <Stack gap={2}>
                  <Text weight="semibold">Badges</Text>
                  <Stack direction="row" gap={2}>
                    <Badge>Default</Badge>
                    <Badge variant="muted">Muted</Badge>
                    <Badge variant="accent">Accent</Badge>
                  </Stack>
                </Stack>

                <Stack gap={2}>
                  <Text weight="semibold">Avatars</Text>
                  <Stack direction="row" gap={4}>
                    <Avatar size="sm" fallback="JD" />
                    <Avatar fallback="JD" />
                    <Avatar size="lg" fallback="JD" />
                  </Stack>
                </Stack>

                <Stack gap={2}>
                  <Text weight="semibold">List</Text>
                  <List>
                    <ListItem>
                      <ListHeader>List Item 1</ListHeader>
                      <ListContent>Description for the first item</ListContent>
                    </ListItem>
                    <ListItem>
                      <ListHeader>List Item 2</ListHeader>
                      <ListContent>Description for the second item</ListContent>
                    </ListItem>
                  </List>
                </Stack>

                <Stack gap={2}>
                  <Text weight="semibold">Table</Text>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Admin</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>User</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Text as="h2" size="xl" weight="semibold">
                Feedback
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap={6}>
                <Alert>
                  <AlertTitle>Default Alert</AlertTitle>
                  <AlertDescription>This is a default alert message.</AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTitle>Error Alert</AlertTitle>
                  <AlertDescription>This is an error alert message.</AlertDescription>
                </Alert>

                <Stack gap={2}>
                  <Text weight="semibold">Progress</Text>
                  <Progress value={progress} />
                  <Stack direction="row" gap={2}>
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      -10
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      +10
                    </Button>
                  </Stack>
                </Stack>

                <Stack gap={2}>
                  <Text weight="semibold">Spinners</Text>
                  <Stack direction="row" gap={4} align="center">
                    <Spinner size="sm" />
                    <Spinner />
                    <Spinner size="lg" />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}
