import { AppCreateButton } from '@/components/app/app-create-button';
import { AppWrapper } from '@/components/app/app-wrapper';
import { MyCombobox } from '@/components/combobox/my-combobox';
import { useResponsive } from '@/modules/app/hooks';
import { CollectionType } from '@/modules/collection/types';
import { Box, Grid, Stack, Tabs, rem, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import classes from '../../styles/Marketplace.module.scss';
import { BannerSection } from './banner-section';
import { CollectionsRanking } from './collections-ranking';
import { ListCollections } from './list-collections-section';

export const MarketplaceScreen = () => {
  const [activeTab, setActiveTab] = useState<string | null>(CollectionType.ALL);
  const theme = useMantineTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <AppWrapper>
      <Box p={theme.spacing.md}>
        <Stack className='Marketplace' w={'100%'}>
          <Tabs value={activeTab} onChange={setActiveTab} maw={isDesktop ? '66.3%' : '100%'} visibleFrom='sm' classNames={{
            root: "tab-root",
            list: "tab-list",
            tab: "tab-button",
          }}>
            <Tabs.List grow>
              {Object.values(CollectionType).map((v, k) => (
                <Tabs.Tab value={v} key={k}>{v}</Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {isMobile && <MyCombobox
            initialvalue={CollectionType.ALL}
            options={CollectionType}
            styles={{
              dropdown: {
                height: rem(200),
                overflow: 'hidden',
                overflowY: 'auto',
              }
            }}
            classNames={{
              dropdown: 'hidden-scroll-bar'
            }}
            classnamesinput={classes.comboboxInput}
            onChange={(val) => setActiveTab(val)}
          />}

          <BannerSection type={activeTab} />

          <Grid w={'100%'}>
            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
              <Stack>
                <ListCollections type={activeTab} />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <CollectionsRanking type={activeTab} />
            </Grid.Col>
          </Grid>

        </Stack>
      </Box>

      <AppCreateButton />
    </AppWrapper>
  )
}