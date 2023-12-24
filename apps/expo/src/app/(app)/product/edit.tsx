import { View } from "react-native-ui-lib";
import ProductForm from "@/components/ProductForm";

export default function EditProductScreen() {
  return (
    <View bg-white padding-s4 flex>
      <ProductForm edit />
    </View>
  );
}
