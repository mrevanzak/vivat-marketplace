import ProductForm from "@/components/ProductForm";
import { View } from "react-native-ui-lib";

export default function EditProductScreen() {
  return (
    <View bg-white padding-s4 flex>
      <ProductForm edit />
    </View>
  );
}