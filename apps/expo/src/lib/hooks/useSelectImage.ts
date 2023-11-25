import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { uploadOptions } from "@/utils/supabase";
import { useTus } from "use-tus";

export function useSelectImage() {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult>();
  const [uploadProggres, setUploadProgress] = useState<number>();

  const { setUpload } = useTus({ autoStart: true });

  const onUpload = useCallback(
    (bucketName: string, filePath: string) => {
      return new Promise<{ error?: Error }>((resolve) => {
        setUpload(image as unknown as Blob, {
          ...uploadOptions(bucketName, filePath),
          onProgress(bytesSent, bytesTotal) {
            setUploadProgress((bytesSent / bytesTotal) * 100);
          },
          onSuccess() {
            resolve({ error: undefined });
          },
          onError(error) {
            resolve({ error });
          },
        });
      });
    },
    [image, setUpload],
  );
  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      exif: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    void async function checkPermission() {
      if (Constants.platform?.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== ImagePicker.PermissionStatus.GRANTED ||
          cameraStatus.status !== ImagePicker.PermissionStatus.GRANTED
        ) {
          Alert.alert("Sorry, we need these permissions to make this work!");
        }
      }
    };
  }, []);

  return { image, onSelectImage, uploadProggres, onUpload };
}
