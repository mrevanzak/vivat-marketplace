import React from "react";
import { ActivityIndicator } from "react-native";
import {
  AnimatedImage,
  BorderRadiuses,
  Card,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import { Link } from "expo-router";
import OnboardingModal from "@/components/modal/onboarding";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { FlashList } from "@shopify/flash-list";

export default function HomeScreen() {
  const { data, refetch, isFetching } = api.category.getCategories.useQuery({
    partial: false,
  });

  return (
    <View flex bg-primary>
      <AnimatedImage
        source={{ uri: "https://bqdpbxgudfvqzcxgvhhn.supabase.co/storage/v1/object/public/assets/banner.png" }}
        height={124}
        style={{ borderRadius: BorderRadiuses.br60 }}
        containerStyle={{
          paddingHorizontal: Spacings.s10,
          paddingTop: Spacings.s2,
          paddingBottom: Spacings.s6,
          backgroundColor: colors.primary,
        }}
        loader={<ActivityIndicator color={colors.secondary} size="large" />}
      />
      <View bg-white br50 flex padding-s4 className="rounded-b-none">
        <FlashList
          data={data}
          numColumns={2}
          estimatedItemSize={50}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <View centerH flex margin-8 className="space-y-2">
                <Link
                  asChild
                  href={{
                    pathname: "/search",
                    params: {
                      categoryId: item.id,
                    },
                  }}
                >
                  <Card flex-1 enableShadow>
                    <AnimatedImage
                      source={{ uri: item.imageUrl }}
                      height={124}
                      width={123}
                      borderRadius={BorderRadiuses.br50}
                      loader={
                        <ActivityIndicator
                          color={colors.secondary}
                          size="large"
                        />
                      }
                    />
                  </Card>
                </Link>
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
      <OnboardingModal />
    </View>
  );
}
