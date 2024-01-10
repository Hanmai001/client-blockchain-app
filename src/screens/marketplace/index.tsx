import { AppWrapper } from '@/components/app/app-wrapper';
import { CollectionTyle } from '@/modules/configs/type';
import { Box, Combobox, ComboboxData, Grid, Group, InputBase, Select, Stack, Tabs, rem, useCombobox, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import classes from '../../styles/Marketplace.module.scss';
import { useResponsive } from '@/modules/app/hooks';
import { BannerSection } from './banner-section';

export const MarketplaceScreen = () => {
  // const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string | null>(CollectionTyle.ALL);
  const theme = useMantineTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <AppWrapper>
      <Box p={theme.spacing.md}>
        <Stack className='Marketplace' w={'100%'}>
          <Tabs value={activeTab} onChange={setActiveTab} maw={isDesktop ? '66.3%' : '100%'} visibleFrom='sm' classNames={{
            root: classes.tabRoot,
            list: classes.tabList,
            tab: classes.tabButton,
          }}>
            <Tabs.List grow>
              {Object.values(CollectionTyle).map((v, k) => (
                <Tabs.Tab value={v} key={k}>{v}</Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {isMobile && <MyCombobox />}
          
          <Grid w={'100%'}>
            <Grid.Col span={{base: 12, md: 8, lg: 8}}>
              <Stack>
                <BannerSection />
              </Stack>
            </Grid.Col>

          </Grid>
          
        </Stack>
      </Box>
    </AppWrapper>
  )
}


const MyCombobox = () => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(CollectionTyle.ALL);

  const options = Object.values(CollectionTyle).map((v, k) => (
    <Combobox.Option py={12} className={v === value ? classes.comboboxOptionSelected : classes.comboboxOption} value={v} key={k}>
      {v}
    </Combobox.Option>
  ))

  return <Combobox
    store={combobox}
    onOptionSubmit={(val) => {
      setValue(val);
      combobox.closeDropdown();
    }}
    styles={{
      dropdown: {
        height: rem(200),
        overflow: 'hidden',
        overflowY: 'auto',
      }
    }}
    classNames={{
      dropdown: classes.hiddenScrollBar
    }}
    >
    <Combobox.Target>
      <InputBase
        component="button"
        type="button"
        pointer
        rightSection={<Combobox.Chevron />}
        rightSectionPointerEvents="none"
        onClick={() => combobox.toggleDropdown()}
        classNames={{
          input: classes.comboboxInput
        }}
      >
        {value}
      </InputBase>
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Options>{options}</Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
}