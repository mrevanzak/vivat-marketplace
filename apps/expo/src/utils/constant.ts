import { Colors } from "react-native-ui-lib";

const colors = {
    primary: "#157DC1",
    secondary: "#FDBC12",
} as const;

Colors.loadColors({
    primary: colors.primary,
    secondary: colors.secondary,
});