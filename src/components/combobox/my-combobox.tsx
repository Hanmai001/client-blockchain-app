import { Combobox, ComboboxProps, InputBase, useCombobox } from "@mantine/core";
import { FC, useState } from "react";
import classes from '../../styles/components/combobox.module.scss';

interface MyComboBox extends ComboboxProps {
  label?: string,
  classnamesinput?: any,
  classnamesroot?: any,
  initialvalue: string,
  options: Object,
  value?: string,
  onChange?: (v: any) => any,
}
export const MyCombobox: FC<MyComboBox> = (props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(props.initialvalue || props.value!);

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

      if (props.onChange)
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
          input: props.classnamesinput,
          root: props.classnamesroot,
        }}
        styles={{
          label: {
            fontWeight: 'bold'
          }
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