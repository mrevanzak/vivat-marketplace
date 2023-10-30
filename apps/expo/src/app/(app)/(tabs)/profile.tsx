import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-ui-lib";
import { useAuth } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView>
      <Button
        label="Logout"
        onPress={() => {
          void signOut();
        }}
      />
    </SafeAreaView>
  );
}
