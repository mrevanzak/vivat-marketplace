import type { TextFieldProps } from "react-native-ui-lib";
import { BorderRadiuses, Spacings, TextField } from "react-native-ui-lib";
import { Controller, get, useFormContext } from "react-hook-form";

import colors from "@vivat/color-palette";

type InputProps = {
  /** Input label */
  label: string;
  /**
   * id to be initialized with React Hook Form,
   * must be the same with the pre-defined types.
   */
  id: string;
  numericFormat?: boolean;
} & TextFieldProps;

export default function Input({
  id,
  label,
  placeholder,
  ...props
}: InputProps) {
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
        <TextField
          placeholder={placeholder ?? `Masukkan ${label.toLowerCase()}...`}
          label={label}
          labelColor={colors.primary}
          containerStyle={InputStyle}
          enableErrors
          retainValidationSpace={false}
          value={field.value ? String(field.value) : ""}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          validationMessage={error?.message}
          {...props}
        />
      )}
    />
  );
}

export const InputStyle = {
  paddingHorizontal: Spacings.s4,
  paddingVertical: Spacings.s2,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: BorderRadiuses.br40,
  marginBottom: Spacings.s4,
};
