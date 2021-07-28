import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    alert: {
      fontSize: 75,
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 25,
      marginTop: 25,
      paddingVertical: 25,
      backgroundColor: '#005eb8',
      flex: 5
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 10,
      marginTop: 10,
      flex: 2
    },
    subTitle: {
      fontSize: 15,
      color: '#000',
      marginBottom: 5,
      marginTop: 5,
      flex: 1
    },
    body: {
      fontSize: 10,
      color: '#000',
      marginBottom: 5,
      marginTop: 5,
    }
  });

export {styles};