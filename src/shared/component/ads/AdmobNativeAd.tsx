import React, { useEffect, useState } from "react";
import { View, ViewStyle, Platform, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeAd, NativeAdView, NativeAsset, NativeAssetType, TestIds } from "react-native-google-mobile-ads";
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

  if (loading) {
    return (
      <View style={[{ alignItems: "center", justifyContent: "center", paddingVertical: 12 }, style]}>
        <ActivityIndicator size="small" color="#999999" />
      </View>
    );
  }

  if (error || !nativeAd) {
    return null;
  }

  return (
    <View style={[{ width: "100%" }, style]}>
      <NativeAdView nativeAd={nativeAd} style={{ width: "100%" }}>
        <View className="flex-row w-full justify-center items-center h-8 border border-gray-200 overflow-hidden">
             <View className="bg-gray-200 rounded px-1 mr-2">
                <Text text="Ad" type="caption1" className="text-gray-600"/>
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
    </View>
  );
}

export default AdmobNativeAd;

