import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // const utils = api.useContext();

  // const postQuery = api.post.all.useQuery();

  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => utils.post.all.invalidate(),
  // });

  return (
    <SafeAreaView>
      {/* Changes page title visible on the header */}
      {/* <Stack.Screen options={{ title: "Home Page" }} /> */}
    </SafeAreaView>
  );
}