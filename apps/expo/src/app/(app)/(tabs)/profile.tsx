import {
  Avatar,
  BorderRadiuses,
  Button,
  Spacings,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Link } from "expo-router";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { isLoaded, signOut, userId } = useAuth();
  const { user } = useUser();
  const { data } = api.user.checkMajor.useQuery();

  if (!isLoaded) {
    return null;
  }

  return (
    <View bg-white padding-s4 flex className="space-y-4">
      <View br40 className="border-primary border bg-white" padding-s4>
        <View row spread>
          <View row centerV className="space-x-4">
            <Avatar
              source={{
                uri: user?.imageUrl,
              }}
              animate
              name={user?.fullName ?? ""}
              useAutoColors
              size={60}
            />
            <View>
              <Text text65>{user?.fullName ?? ""}</Text>
              <Text text90R>{data?.major}</Text>
              <Text text90R>{user?.primaryEmailAddress?.emailAddress}</Text>
            </View>
          </View>
          <View centerV>
            <Link
              asChild
              href={{
                pathname: "/search",
                params: {
                  sellerId: userId!,
                },
              }}
            >
              <Button
                round
                enableShadow
                backgroundColor={colors.primary}
                iconSource={() => (
                  <MaterialIcons
                    name="storefront"
                    size={20}
                    color={colors.secondary}
                  />
                )}
              />
            </Link>
          </View>
        </View>
      </View>
      <View br40 className="border-primary border bg-white" padding-s4>
        <Link asChild href="/order/">
          <TouchableOpacity row centerV className="space-x-3">
            <FontAwesome name="shopping-bag" size={20} color={colors.primary} />
            <Text text70 primary>
              Pembelian
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Button
        label="Keluar"
        outline
        outlineColor={colors.primary}
        borderRadius={BorderRadiuses.br30}
        onPress={signOut}
        labelStyle={{ marginLeft: Spacings.s1 }}
        iconSource={() => (
          <MaterialIcons name="logout" size={20} color={colors.primary} />
        )}
      />
    </View>
  );
}
