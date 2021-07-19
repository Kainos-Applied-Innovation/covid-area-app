import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, Button, Alert } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { getCouncil, listCouncils, getRestrictions } from './src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import * as Location from 'expo-location';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
Amplify.configure(awsmobile);

const App = () => {

  const [council, setCouncil] = useState(null);
  const [restrictions, setRestrictions] = useState(null);
  const [alertLevel, setAlertLevel] = useState(null);
  const [councilList, setCouncilList] = useState([])

  // Get local Storage - location state
  async function getLocalStorage() {
    try {
      const jsonValue = await AsyncStorage.getItem('@location')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log("Error caught for local storage");
      return null;
    }
  }

  // Write local Storage - location state
  async function writeLocalStorage (locationState, alertState) {
    try {
      jsonState = {
        'council' : locationState,
        'level' : alertState
      }
      const jsonValue = JSON.stringify(jsonState)
      await AsyncStorage.setItem('@location', jsonValue);
      return 1;
    } catch (e) {
      // saving error
      console.log("Storage write failure");
      return null;
    }
  }

  // Get Council names from GQL
  async function fetchCouncilNames() {
    try {
      const councilData = await API.graphql(graphqlOperation(listCouncils));
      const councilNames = [];
      var areas = councilData.data.listCouncils.items;
      for(let area in areas){
        councilNames.push(areas[area].id);
      };
      councilNames.sort();
      setCouncilList(councilNames);
    } catch (err) { console.log(err) }
  }

  // Get Alert Level for Council from GQL
  async function fetechAlertLevel(councilName) {
    try {
      const alert = await API.graphql(graphqlOperation(getCouncil(councilName)));

      // TODO check parse
      setAlertLevel(alert.data.getCouncil.items);

    } catch (err) { console.log(err) }
  }

  // Get Restrictions for Level
  async function fetchRestrictions(level) {
    try {
      const restrictions = await API.graphql(graphqlOperation(getRestrictions(level)));

      // TODO check parse
      setRestrictions(restrictions.data.getRestrictions.items);

    } catch (err) { console.log(err) }
  }

  // Check location and reverseGeoCode
  async function checkLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              console.log('Permissions Denied... returning dummy location')
              
              // Default Test Case
              let location = {
                "coords": { 
                  "latitude": 55.855780807135005, 
                  "longitude": -4.25534451672934  
                },
                "timestamp": 1626209145852.0579  
              };

              let region = await Location.reverseGeocodeAsync({
                latitude : location.coords.latitude,
                longitude : location.coords.longitude
              });
              setCouncil(region[0].subregion);
              return; 
            }
      
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
            let region = await Location.reverseGeocodeAsync({
              latitude : location.coords.latitude,
              longitude : location.coords.longitude
            });

            console.log("Checking reverseGeoCode:" + region[0].subregion);
            setCouncil(region[0].subregion);

    } catch (err) { console.log(err); }
  }

  // On page load, populate council list, check perms & get location
  useEffect(() => {
    fetchCouncilNames();
    checkLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        Alert Level:
      </Text>
      <Text style={styles.title}>
        {alertLevel}
      </Text>
      
      
      <SelectDropdown
	      data={councilList}
        defaultValue={council}
      	onSelect={(selectedItem, index) => {
		      setCouncil(selectedItem);

          // TODO
          // Use selected item to get alert level
          // update screen
          // display updated restrictions
	      }}

	      buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
	      }}
	      
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
	      }}
      />

      <Button
        title="Use My Location"
        onPress = {() => {
          checkLocation();
        }}
      />
      <Text style={styles.title}>
        Restrictions:
      </Text>
      <Text style={styles.title}>
        {restrictions}
      </Text>
    </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;