import React, { useEffect, useState } from "react";
import { View, ViewStyle, Platform } from "react-native";
import { NativeAd, NativeAdView, NativeAsset, NativeAssetType, TestIds, NativeAdChoicesPlacement } from "react-native-google-mobile-ads";
import { GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_ANDROID, GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_IOS } from '@env';
import { useTrackingStore } from "@store/trackingStore";
import { Text } from "@shared/component/Text";

type AdmobNativeAdProps = {
  style?: ViewStyle;
  requestNonPersonalizedAdsOnly?: boolean;
};

const UNIT_ID_NATIVE = 
  __DEV__ ? 
  TestIds.NATIVE : 
  Platform.select({ 
    android: GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_ANDROID, 
    ios: GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_IOS 
  }) || TestIds.NATIVE;

export function AdmobNativeAd({
  style,
  requestNonPersonalizedAdsOnly,
}: AdmobNativeAdProps) {
  const { isTrackingAuthorized } = useTrackingStore();
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const shouldRequestNonPersonalizedAds = requestNonPersonalizedAdsOnly !== undefined 
    ? requestNonPersonalizedAdsOnly 
    : !isTrackingAuthorized;

  useEffect(() => {
    let mounted = true;

    const loadAd = async () => {
      try {
        setLoading(true);
        setError(false);
        const ad = await NativeAd.createForAdRequest(UNIT_ID_NATIVE, {
          requestNonPersonalizedAdsOnly: shouldRequestNonPersonalizedAds,
          // AdChoices 오버레이 위치 설정 (기본값: TOP_RIGHT)
          adChoicesPlacement: NativeAdChoicesPlacement.TOP_RIGHT,
        });
        if (mounted) {
          setNativeAd(ad);
          setLoading(false);
        }
      } catch (err) {
        console.error('[AdmobNativeAd] Failed to load native ad', err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadAd();

    return () => {
      mounted = false;
      if (nativeAd) {
        nativeAd.destroy();
      }
    };
  }, [shouldRequestNonPersonalizedAds]);

  return (
    <View style={[{ width: "100%" ,height:32}, style]}>
        {loading || error || !nativeAd ? null :
      <NativeAdView nativeAd={nativeAd} style={{ width: "100%",height:'100%' }}>
        <View className="flex-row w-full h-full justify-start items-center overflow-hidden border border-gray-200">
             <View className="bg-gray-200 rounded px-1 mr-2">
                <Text text="AD" type="caption1" className="text-gray-600"/>
             </View>
              {nativeAd.body && (
                <NativeAsset assetType={NativeAssetType.BODY}>
                  <Text 
                    text={nativeAd.body} 
                    type="caption1" 
                    className="text-gray-600"
                    numberOfLines={1}
                  />
                </NativeAsset>
              )}
        </View>
      </NativeAdView>
}
    </View>
  );
}

export default AdmobNativeAd;

