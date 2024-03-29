import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { fetchData } from "./utils";



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Waiting_Driver_Screen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [toiletData, setToiletData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
    };

    getLocation();
  }, []);

  useEffect(() => {
    fetchData(currentLocation)
    .then((response) => {
      setToiletData(response)
      setIsLoading(true)
    })
    .catch((err) => {
      console.log(err)
    })
  },[])

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />  
          )}
           {toiletData.map((toilet)=> (
              <Marker key={toilet.id}
              draggable
              coordinate={{
                latitude: toilet.latitude,
                longitude: toilet.longitude,
              }}
              onDragEnd={
                (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
              }
              title={toilet.name}
              description={toilet.directions}
            />
            ))}
        </MapView>
      )}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});


export default Waiting_Driver_Screen;
