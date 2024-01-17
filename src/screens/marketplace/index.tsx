import { AppWrapper } from '@/components/app/app-wrapper';
import { Box, Combobox, ComboboxData, ComboboxProps, Grid, Group, InputBase, InputBaseProps, Select, Stack, Tabs, rem, useCombobox, useMantineTheme } from '@mantine/core';
import { FC, useState } from 'react';
import classes from '../../styles/Marketplace.module.scss';
import { useResponsive } from '@/modules/app/hooks';
import { BannerSection } from './banner-section';
import { ListCollections } from './list-collections-section';
import { CollectionsRanking } from './collections-ranking';
import { AppCreateButton } from '@/components/app/app-create-button';
import { CollectionType } from '@/modules/collection/types';

export const MarketplaceScreen = () => {
  const [activeTab, setActiveTab] = useState<string | null>(CollectionType.ALL);
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
              {Object.values(CollectionType).map((v, k) => (
                <Tabs.Tab value={v} key={k}>{v}</Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {isMobile && <MyCombobox 
            initialValue={CollectionType.ALL}
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
            classNamesInput={classes.comboboxInput}
          />}

          <BannerSection />

          <Grid w={'100%'}>
            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
              <Stack>
                <ListCollections />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 4 }}>
              <CollectionsRanking />
            </Grid.Col>
          </Grid>

        </Stack>
      </Box>

      <AppCreateButton />
    </AppWrapper>
  )
}

interface MyComboBox extends ComboboxProps {
  label?: string,
  classNamesInput?: any,
  classNamesRoot?: any,
  initialValue: string,
  options: Object,
  value?: string,
  onChange?: () => any,
}

export const MyCombobox: FC<MyComboBox> = (props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(props.initialValue || props.value!);

  const options = Object.values(props.options).map((v, k) => (
    <Combobox.Option py={12} className={v === value ? classes.comboboxOptionSelected : classes.comboboxOption} value={v} key={k}>
      {v}
    </Combobox.Option>
  ))

  return <Combobox
    store={combobox}
    onOptionSubmit={(val) => {
      setValue(val);
      combobox.closeDropdown();
      props.onChange(val);
    }}
    {...props as any}
  >
    <Combobox.Target>
      <InputBase
        value={props.value}
        onChange={props.onChange}
        withAsterisk
        label={props.label}
        component="button"
        type="button"
        pointer
        rightSection={<Combobox.Chevron />}
        rightSectionPointerEvents="none"
        onClick={() => combobox.toggleDropdown()}
        classNames={{
          input: props.classNamesInput,
          root: props.classNamesRoot,
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