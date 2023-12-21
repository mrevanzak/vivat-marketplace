import type { RadioButtonProps as UIRadioButtonProps } from "react-native-ui-lib";
import { Text, RadioButton as UIRadioButton } from "react-native-ui-lib";
import { Controller, get, useFormContext } from "react-hook-form";

import colors from "@vivat/color-palette";

type RadioButtonProps = {
  /**
   * id to be initialized with React Hook Form,
   * must be the same with the pre-defined types.
   */
  id: string;

  /**
   * value to be passed to the onChange function
   * when the button is pressed.
   */
  options: string[];
} & UIRadioButtonProps;

export default function RadioButton({
  id,
  options,
  ...props
}: RadioButtonProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, id) as Error;

  return (
    <Controller
      control={control}
      name={id}
      render={({ field }) => (
        <>
          {error && (
            <Text red40 text80 marginB-s2>
              {error.message}
            </Text>
          )}
          {options.map((option, index) => (
            <UIRadioButton
              label={option}
              key={index}
              color={colors.primary}
              selected={field.value === option}
              onPress={() => setValue(id, option)}
              {...props}
            />
          ))}
        </>
      )}
    />
  );
}
