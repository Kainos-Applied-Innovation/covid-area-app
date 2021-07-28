import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overallContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    alertContainer: {
      flex: 2,
      backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scollContainer: {
      flex: 2,
      backgroundColor: '#fff'
        
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
      paddingVertical: 10,
      flex: 1
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