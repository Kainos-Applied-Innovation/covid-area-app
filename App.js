import React, {useState, useEffect} from 'react';
import { Text, View, SafeAreaView, Button, ScrollView, Alert } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { getCouncil, listCouncils, getRestrictions } from './src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Amplify from 'aws-amplify';
import styles from './styles';
import awsAmplify from './src/awsAmplify';
import awsmobile from './src/aws-exports';

if (process.env.GITHUB_ACTIONS == true){
  // use the env variables in GitHub
  Amplify.configure(awsAmplify);
}
else{
  Amplify.configure(awsmobile);
}

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
    let jsonState = {
      'council' : locationState,
      'level' : alertState
    }
    const jsonValue = JSON.stringify(jsonState)
    await AsyncStorage.setItem('@location', jsonValue);
    return 1;
  } catch (err) {
    // saving error
    console.log("Storage write failure - " + err);
    return null;
  }
}

const App = () => {
  const [open, setOpen] = useState(false);
  const [councilList, setCouncilList] = useState([]);
  const [council, setCouncil] = useState('Glasgow');
  const [alertLevel, setAlertLevel] = useState(0);
  const [restrictions, setRestrictions] = useState({
    overview: '',
    open: '',
    closed: ''
  });

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  const locationChangeAlert = () =>
  Alert.alert(
    "Change in Restrictions",
    "Restrictions have changed in your area, please check the updated restrictions",
    [
      { text: "OK", onPress: () => console.log("Alert Dismissed") }
    ],
    { cancelable: false }
  );

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

  // get the alert level for the selected council, using the data in councilList
  async function fetchAlertLevel(selectedCouncil) {
    try {
      let level = 0;

      for (let area in councilList){
        if (councilList[area].value === selectedCouncil){
          level = councilList[area].level;
          break;
        }
      }

      setAlertLevel(level);
      return level;
    } catch (err) { 
      console.log(err) 
      return level;
    }
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
        setCouncil('Glasgow City');   
        return; 
      } else {
        // Location permissions granted
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
          console.log("Location not in Scotland, defaulting to Glasgow City")
          setCouncil('Glasgow City');
        }
      }
    } catch (err) { console.log(err); }
  }

  // On page load, populate council list
  useEffect(() => {
    fetchCouncilNames();
    fetchAlertLevel(council)

    getLocalStorage().then((stateChange) =>{
      if (stateChange !== null) {
        // Previous app use, check if dif from current & alert to changes 
        if (alertLevel !== stateChange.level){
          locationChangeAlert();
        }
      } else {
        console.log("No previous state");
      }  
    });
  }, []);

  return (
    <SafeAreaView style={styles.overallContainer}>
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>
          Alert Level
        </Text>
        <Text className="alertLevel" style={styles.alert}>
          {alertLevel}
        </Text>
      </View>
      
      <View style={styles.container}>
        <Button
          className="useMyLocationButton"
          title = "Use My Location"
          style = {styles.button}
          onPress = {() => {
            checkLocation();
          }}
        />

        <DropDownPicker
          className="councilDropDown"
          open = {open}
          value = {council}
          items = {councilList}
          setOpen = {setOpen}
          setValue = {setCouncil}
          setItems = {setCouncilList}
          theme = "LIGHT"
          dropDownDirection = "AUTO"

          onChangeValue={(value) => {
            fetchAlertLevel(council).then((level) =>{
              fetchRestrictions();
              writeLocalStorage(council, level);
            });
          }}
        />

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
      </View>
    </SafeAreaView>
  );
}

export default App;
