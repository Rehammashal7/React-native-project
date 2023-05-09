import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import profile from './pages/profile'
import Favorite from './pages/Favorite';

import  { BurgerDetails, ProductsListBurger } from './pages/Burgers';
import  { CoffeeDetails, ProductsListCoffee } from './pages/Drink';

import { PizzaDetails, ProductsListPizza } from './pages/ProductsListPizza';
import AddProductForm from './pages/AddProductForm';
import products from './pages/AddProducts'
import { OfferDetails, ProductsListOffer } from './pages/Offers';
import CartScreen from './pages/CartScreen';
import Checkout from './pages/Checkout';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Burgers" component={ProductsListBurger} />
        <Stack.Screen name="Coffee" component={ProductsListCoffee} />
        <Stack.Screen name="Offer" component={ProductsListOffer} />
        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="PizzaDetails" component={PizzaDetails}  />
        <Stack.Screen name="OfferDetails" component={OfferDetails}  />
        <Stack.Screen name="CoffeeDetails" component={CoffeeDetails}  />
        <Stack.Screen name="BurgerDetails" component={BurgerDetails}  />
        <Stack.Screen name="Pizza" component={ProductsListPizza} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name ="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="profile" component={profile}  />
        <Stack.Screen name="products" component={products}  />
        <Stack.Screen name="CartScreen" component={CartScreen }  />
        <Stack.Screen name="Checkout" component={Checkout }  />

       
      </Stack.Navigator>
    </NavigationContainer>
  );
}