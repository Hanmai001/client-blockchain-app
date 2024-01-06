import { blockChainContext, useBlockChain } from '@/share/blockchain/context';
import { Card, Image, Text, Badge, Button, Group, useMantineColorScheme } from '@mantine/core';
import { useContext } from 'react';

export const MarketplaceScreen = () => {
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  
  return (
    <>
      <Group>
        <Button onClick={() => setColorScheme('light')}>Light</Button>
        <Button onClick={() => setColorScheme('dark')}>Dark</Button>
        <Button onClick={() => setColorScheme('auto')}>Auto</Button>
        <Button onClick={clearColorScheme}>Clear</Button>
      </Group>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge color="pink">On Sale</Badge>
        </Group>

        <Text size="sm">
          With Fjord Tours you can explore more of the magical fjord landscapes with tours and
          activities on and around the fjords of Norway
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </>
  )
}