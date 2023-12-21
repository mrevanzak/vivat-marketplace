import type { PickerProps as OGPickerProps } from "react-native-ui-lib";
import {
  BorderRadiuses,
  Picker as OGPicker,
  Spacings,
} from "react-native-ui-lib";
import { Controller, get, useFormContext } from "react-hook-form";

import colors from "@vivat/color-palette";

type PickerProps = {
  /** Input label */
  label: string;
  /**
   * id to be initialized with React Hook Form,
   * must be the same with the pre-defined types.
   */
  id: string;
} & OGPickerProps;

export default function Picker({
  id,
  label,
  placeholder,
  ...props
}: PickerProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const error = get(errors, id) as Error;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field }) => (
        <OGPicker
          placeholder={placeholder ?? `Masukkan ${label.toLowerCase()}...`}
          label={label}
          labelColor={colors.primary}
          containerStyle={{
            paddingHorizontal: Spacings.s4,
            paddingVertical: Spacings.s2,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: BorderRadiuses.br40,
            marginBottom: Spacings.s4,
          }}
          enableErrors
          retainValidationSpace={false}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          validationMessage={error?.message}
          useSafeArea
          migrate
          {...props}
        >
          {props.items?.map((value) => (
            <OGPicker.Item
              key={value.value}
              value={value.value}
              label={value.label}
              disabled={value.disabled}
              selectedIconColor={colors.primary}
            />
          ))}
        </OGPicker>
      )}
    />
  );
}
