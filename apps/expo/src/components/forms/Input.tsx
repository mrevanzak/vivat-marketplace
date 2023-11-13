import type { TextFieldProps } from "react-native-ui-lib";
import { BorderRadiuses, Spacings, TextField } from "react-native-ui-lib";
import colors from "@/utils/colors";
import { Controller, get, useFormContext } from "react-hook-form";

type InputProps = {
  /** Input label */
  label: string;
  /**
   * id to be initialized with React Hook Form,
   * must be the same with the pre-defined types.
   */
  id: string;
} & TextFieldProps;

export default function Input({ id, label, ...props }: InputProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const error = get(errors, id);

  return (
    <Controller
      control={control}
      name={id}
      render={({ field }) => (
        <TextField
          placeholder={`Input ${id}`}
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
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          validationMessage={error?.message}
          {...props}
        />
      )}
    />
  );
}
