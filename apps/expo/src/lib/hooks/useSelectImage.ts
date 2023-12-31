import { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { uploadOptions } from "@/utils/supabase";
import { toast } from "@backpackapp-io/react-native-toast";
import { useTus } from "use-tus";

export function useSelectImage() {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult>();
  const [uploadProggres, setUploadProgress] = useState<number>();

  const { setUpload } = useTus({ autoStart: true });

  const onUpload = useCallback(
    (bucketName: string, filePath: string) => {
      if (!image) {
        return Promise.resolve({ error: new Error("No image selected") });
      }
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
          toast.error("Mohon izinkan akses kamera dan galeri");
        }
      }
    };
  }, []);

  return { image, onSelectImage, uploadProggres, onUpload };
}
