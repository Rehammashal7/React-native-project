// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
//import Checkout from './Checkout'; 
import React, { useEffect,useState } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,Pressable } from 'react-native';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../Consts/Color';


const Checkout = ({navigation}) =>{
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd`;
    script.addEventListener('load', () => {
     
      window.paypal.Buttons().render('#paypal-button');
  
    },);
    document.body.appendChild(script);
  }, []);
  // const createOrder = (data, actions) => {
  //   return actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           currency_code: 'USD',
  //           value: amount,
  //         },
  //       },
  //     ],
  //   });
  // };
  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      firebase.firestore().collection('payments').add({
        payerId: details.payer.payer_id,
        purchaseAmount: amount,
        create_time: details.create_time,
      }).then(() => {
        navigation.navigate('ConfirmationScreen');
      }).catch((error) => {
        setError(error.message);
      });
    });
  };
  const onError = (err) => {
    setError(err.message);
  };
  return (
    <View style={styles.container}>
      {/* <TextInput
        style={styles.input}
         placeholder="Enter Amount"
        keyboardType="decimal-pad"
        onChangeText={setAmount}
        value={amount}
      /> */}
      {error && <Text style={styles.error}>{error}</Text>}
      <PayPalScriptProvider
        options={{ "client-id": "AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd" }}
      >
        {/* <PayPalButtons
          createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        /> */}
        
<PayPalButtons
            style={{ layout: 'horizontal' }}
            // createOrder={(data, actions) => {
            //   // This function is called when the button is clicked
            //   // You can customize the order details here
            //   return actions.order.create({
            //     purchase_units: [
            //       {
            //         amount: {
            //           value: '0.01', // Example amount, should be replaced with actual value
            //         },
            //       },
            //     ],
            //   });
            // }}
            onApprove={onApprove}
            onError={onError}
          />
      </PayPalScriptProvider>
      <View style={styles.paypalContainer}>
        <View style={styles.paypalButton} id="Checkout"></View>
      </View>
      
               <View style={styles.NavContainer} >
                <View style={styles.Navbar} >
                    {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                        <Icon name="heart" size={25} color="gray" />
                    </Pressable> */}
                    {/* <Pressable onPress={() => navigation.navigate("Checkout")} style={styles.iconBehave} >
                       <Icon name="cube" size={30} color="gray" />
                   </Pressable> */}
                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey}/>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('CartScreen', { userId: userId })}style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable>

                </View>
            </View>
    </View>
      );
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
      paypalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
      },
      paypalButton: {
        height: 0,
        color: 'blue',
      },
      NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.darkblue,
        width: 38,
        justifyContent: 'space-evenly',
        borderRadius: 30,
        height: 40

    },
     iconBehave:{
      padding:44,
      bottom:35
   },
    });
    
export default Checkout ;