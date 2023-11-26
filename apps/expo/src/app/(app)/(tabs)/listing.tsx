import React from "react";
import { View } from "react-native-ui-lib";
import ProductForm from "@/components/ProductForm";

export default function UploadProductScreen() {
  return (
    <View bg-white padding-s4 flex>
      <ProductForm />
    </View>
  );
}
