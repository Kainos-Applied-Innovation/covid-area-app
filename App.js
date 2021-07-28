import React, {useState, useEffect} from 'react';
import { Text, View, SafeAreaView, Button, ScrollView } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { getCouncil, listCouncils, getRestrictions } from './src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
Amplify.configure(awsmobile);

import styles from './styles';

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


const App = () => {
  const [open, setOpen] = useState(false);
  const [councilList, setCouncilList] = useState([]);
  const [council, setCouncil] = useState('Glasgow');
  const [restrictions, setRestrictions] = useState({
    overview: '',
    open: '',
    closed: ''
  });
  const [alertLevel, setAlertLevel] = useState(0);
  
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // Get Council names from GQL
  async function fetchCouncilNames() {
    try {
      const councilData = await API.graphql(graphqlOperation(listCouncils));
      const councilNames = [];
      var areas = councilData.data.listCouncils.items;
      for(let area in areas){
        councilNames.push({label: areas[area].id, value: areas[area].id, level: areas[area].level});
      };
      councilNames.sort();
      setCouncilList(councilNames);
    } catch (err) { console.log(err) }
  }

  // Get Alert Level for Current Council State from GQL
  async function fetechAlertLevel() {
    try {
      const alert = await API.graphql(graphqlOperation(getCouncil, {id: council}));
      setAlertLevel(alert.data.getCouncil.level);

    } catch (err) { console.log(err) }
  }

  // Get Restrictions for Current Level
  async function fetchRestrictions() {
    try {
      const response = await API.graphql(graphqlOperation(getRestrictions, {id: alertLevel.toString()}));
      
      // TODO check parse
      setRestrictions({
        overview: response.data.getRestrictions.overview,
        open: response.data.getRestrictions.open,
        closed: response.data.getRestrictions.closed 
      });

    } catch (err) { console.log(err) }
  }

  // Check location and reverseGeoCode
  async function checkLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissions Denied... returning dummy location')
        
        // Default Test Case
        // let location = {
        //   "coords": { 
        //     "latitude": 55.855780807135005, 
        //     "longitude": -4.25534451672934  
        //   },
        //   "timestamp": 1626209145852.0579  
        // };

        // let region = await Location.reverseGeocodeAsync({
        //   latitude : location.coords.latitude,
        //   longitude : location.coords.longitude
        // });

        // area = region[0].subregion;
        setCouncil('Glasgow City');
        
        return; 
      } else {

        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
        let region = await Location.reverseGeocodeAsync({
          latitude : location.coords.latitude,
          longitude : location.coords.longitude
        });

        let area = region[0].subregion;

        console.log("Checking reverse GeoCode: " + area);
        
        if (area in councilList){
          setCouncil(area);
        } else {
          setCouncil('Glasgow City');
        }
      }

    } catch (err) { console.log(err); }
  }
  
  // On page load, populate council list, check perms & get location
  useEffect(() => {
    fetchCouncilNames();
    // checkLocation();

    fetechAlertLevel()

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
    <SafeAreaView style={styles.overallContainer}>
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>
          Alert Level
        </Text>
        <Text style={styles.alert}>
          {alertLevel}
        </Text>
      </View>
      
      
      <View style={styles.container}>
       
      <Button
          title = "Use My Location"
          style = {styles.button}
          onPress = {() => {
            checkLocation();
          }}
        />

        <DropDownPicker
          open = {open}
          value = {council}
          items = {councilList}
          setOpen = {setOpen}
          setValue = {setCouncil}
          setItems = {setCouncilList}
          theme = "LIGHT"
          dropDownDirection = "AUTO"

          onChangeValue={(value) => {
            fetechAlertLevel();
            fetchRestrictions();
          }}
        />

        
        
      </View>

      <View style={styles.scrollContainer}>
        <Text style={styles.title}>
            Restrictions:
        </Text>

        <ScrollView>
          
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
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

export default App;