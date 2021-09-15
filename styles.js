import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
    overallContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    alertContainer: {
      flex: 3,
      backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        zIndex: 10,
        minHeight: '50%'
    },
    scrollContainer: {
      flex: 3,
      backgroundColor: '#fff',
      paddingTop: StatusBar.currentHeight,  
    },
    alert: {
      fontSize: 100,
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#fff',
      textAlign:'center',
      paddingVertical: 35,
      backgroundColor: '#005eb8',
      flex: 2
    },
    alertTitle: {
      textAlign: 'center',
      fontSize: 35,
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#005eb8',
      paddingTop: 25,
      flex: 1
    },
    activityIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: '10%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
      },
    subTitle: {
      fontSize: 15,
      color: '#000',
      paddingHorizontal: 5,
      paddingVertical: 5
    },
    body: {
      fontSize: 10,
      color: '#000',
      paddingHorizontal: 5
    },
    button: {
        width: 100
    },
    selector: {
      width: 100
    }
  });