import React from "react";
import { Avatar, BorderRadiuses, Card, Text, View } from "react-native-ui-lib";
import { api } from "@/utils/api";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { FlashList } from "@shopify/flash-list";
import { useSearchStore } from "@/lib/stores/useSearchStore";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValues";

export default function SearchScreen() {
  const search = useSearchStore((state) => state.search);
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const { data, isFetching, refetch } = api.product.getProduct.useQuery(debouncedSearch);

  return (
    <View flex-1 bg-primary>
      <View bg-white br50 absF padding-s4 className="rounded-b-none">
        <Text primary text65>
          Produk
        </Text>
        <FlashList
          data={data}
          numColumns={2}
          estimatedItemSize={200}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <Card flex-1 margin-8 enableShadow>
                <Card.Image
                  source={{ uri: item.image }}
                  height={250}
                  borderRadius={BorderRadiuses.br60}
                />
                <View
                  padding-s2
                  absH
                  bg-black
                  br50
                  className="bottom-0 opacity-70"
                >
                  <Text white>{item.name}</Text>
                  <Text white>{rupiahFormatter(item.price)}</Text>
                  <View row right centerV>
                    <Avatar
                      source={{ uri: item.user.imageUrl }}
                      animate
                      useAutoColors
                      size={28}
                    />
                    <View padding-s2>
                      <Text text100 white>
                        {item.user.name}
                      </Text>
                      <Text text100 white>
                        {item.user.email}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            );
          }}
        />
      </View>
    </View>
  );
}
