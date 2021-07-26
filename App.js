import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, Button, Alert } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { getCouncil, listCouncils, getRestrictions } from './src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
Amplify.configure(awsmobile);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Get local Storage - location state
async function getLocalStorage() {
  try {
    const jsonValue = await AsyncStorage.getItem('@location')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(err) {
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
  } catch (err) {
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

// Get Alert Level for Current Council State from GQL
async function fetechAlertLevel() {
  try {
    const alert = await API.graphql(graphqlOperation(getCouncil(council)));

    // TODO check parse
    setAlertLevel(alert.data.getCouncil.items);

  } catch (err) { console.log(err) }
}

// Get Restrictions for Current Level
async function fetchRestrictions() {
  try {
    const restrictions = await API.graphql(graphqlOperation(getRestrictions(alertLevel)));

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

const App = () => {

  const [council, setCouncil] = useState(null);
  const [restrictions, setRestrictions] = useState(null);
  const [alertLevel, setAlertLevel] = useState(null);
  const [councilList, setCouncilList] = useState([])
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  
  // On page load, populate council list, check perms & get location
  useEffect(() => {
    fetchCouncilNames();
    checkLocation();

    const stateChange = getLocalStorage();
    if (stateChange !== null) {
      // Previous app use, check if dif from current & push notif
    } else {
      console.log("No previous state");
    }

    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Alert Level:
        </Text>
        <Text style={styles.alert}>
          {alertLevel}
        </Text>
        
        
        <SelectDropdown
          data={councilList}
          defaultValue={council}
          onSelect={(selectedItem, index) => {
            setCouncil(selectedItem);
            
            fetechAlertLevel();
            fetchRestrictions();
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
        <Text style={styles.subTitle}>
          Overview:
        </Text>
        <Text style={styles.body}>
        {restrictions.overview}
        </Text>
        <Text style={styles.subTitle}>
          Open:
        </Text>
        <Text style={styles.body}>
        {restrictions.open}
        </Text>
        <Text style={styles.subTitle}>
          Closed:
        </Text>
        <Text style={styles.body}>
        {restrictions.closed}
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
  alert: {
    fontSize: '35',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '15',
    marginTop: '15',
    paddingVertical: '20',
    backgroundColor: '#005eb8'
  },
  title: {
    fontSize: '20',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '10',
    marginTop: '10',
  },
  subTitle: {
    fontSize: '15',
    color: '#000',
    marginBottom: '5',
    marginTop: '5',
  },
  body: {
    fontSize: '10',
    color: '#000',
    marginBottom: '5',
    marginTop: '5',
  }

});

export default App;