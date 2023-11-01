import { api } from "@/utils/api";
import React from "react";
import { Text, View } from "react-native-ui-lib";

export default function SearchScreen() {
  const { data, isLoading, error } = api.product.getProduct.useQuery();
  
  console.log(data, isLoading, error);
  return (
    <View flex-1 bg-primary>
      <View bg-white br50 absF padding-s4>
        <Text primary text65>Produk</Text>
      </View>
    </View>
  );
}
