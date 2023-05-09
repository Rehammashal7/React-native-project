import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable, ScrollView, Dimensions } from 'react-native';
import Countdown from 'react-countdown';

import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import Food, { Offer, filterData } from '../data';
import COLORS from '../Consts/Color';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = 'AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd';

// Generate required css


// Inject stylesheet


const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [indexCheck, setIndexCheck] = useState("0")

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    return (
        <PayPalScriptProvider options={{ 'client-id': 'AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd'}}>
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.Text}> Fast Food </Text>
            </View>

            <ScrollView>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#808080" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        onChangeText={handleSearch}
                        value={searchQuery}
                    />
                </View>

                <View>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={filterData}
                        keyExtractor={(item) => item.id}
                        extraData={indexCheck}
                        renderItem={({ item, index }) => (
                            <Pressable
                                onPress={() => navigation.navigate(item.name)}
                            >
                                <View style={indexCheck === item.id ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
                                    <Image
                                        style={{ height: 60, width: 60, borderRadius: 30 }}
                                        source={item.image}
                                    />

                                    <View>
                                        <Text style={indexCheck === item.id ? { ...styles.smallCardTextSected } :
                                            { ...styles.smallCardText }}>{item.name}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />
                </View>
                <View style={styles.headerTextView}>
                    <Text style={styles.headerText}>Free Delivery now</Text>
                </View>

                <View>

                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ marginLeft: 15, fontSize: 16, marginTop: -10, marginRight: 5 }} >Options changing in</Text>
                        <Countdown
                            until={3600}
                            size={14}
                            digitStyle={{ backgroundColor: 'lightgreen' }}
                            digitTxtStyle={{ color: '#131A2C' }}
                            timeToShow={['M', 'S']}
                            timeLabels={{ m: 'Min', s: 'Sec' }}
                        />
                    </View>

                    <FlatList
                        style={{ marginTop: 10, marginBottom: 10 }}
                        horizontal={true}
                        data={Offer}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={{ marginRight: 5 }}>
                                <FoodCard
                                    screenWidth={300}
                                    images={item.images}
                                    restaurantName={item.restaurantName}
                                    price={item.price}
                                />
                            </View>
                        )}
                    />
                </View>


                <View style={styles.headerTextView}>
                    <Text style={styles.headerText}>Promotions available</Text>
                </View>

                <View>
                    <FlatList
                        style={{ marginTop: 10, marginBottom: 10 }}
                        horizontal={true}
                        data={Offer}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={{ marginRight: 5 }}>
                                <FoodCard
                                    screenWidth={300}
                                    images={item.images}
                                    restaurantName={item.restaurantName}
                                    price={item.price}
                                />
                            </View>
                        )}
                    />
                </View>


                {/* <View style ={styles.headerTextView}>
            <Text style ={styles.headerText}>Restaurants in your Area</Text>
        </View>
        <View>
        <FlatList 
               style ={{marginTop:10, marginBottom:10}} 
               horizontal ={true}
               data = {Food}
               keyExtractor = {(item,index)=>index.toString()}   
               showsHorizontalScrollIndicator = {false}
               renderItem = {({item})=>(
                   <View style ={{marginRight:5}}>
                       <FoodCard 
                            screenWidth={170}
                            images={item.images}
                            restaurantName={item.restaurantName}
                            price={item.price} 
                       />
                   </View>
               )}  
            />
        </View> */}
                {/* <View style ={{paddingTop:10}}>
        { 
            Food.map(item =>(
                <View key ={item.id} style = {{paddingBottom:20}}>
                <FoodCard 
                             screenWidth={170}
                             images={item.images}
                             restaurantName={item.restaurantName}
                             price={item.price} 
                       />
                </View>
            )
            )
        }        
    </View>     */}
                {/* <View>
        <FlatList
            style={{ marginTop: 10, marginBottom: 10 }}
            vertical={true}
            numColumns={2}
            data={Food}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <View style={{ marginRight: 3 }}>
                    <FoodCard
                        screenWidth={170}
                        images={item.images}
                        restaurantName={item.restaurantName}
                        price={item.price} />
                </View>

            )} 
            />
    </View> */}

                <View style={styles.bottoms}></View>
            </ScrollView>

            <View style={styles.NavContainer} >
                <View style={styles.Navbar} >
                    {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                        <Icon name="heart" size={25} color="gray" />
                    </Pressable> */}
                    {/* <Pressable onPress={() => navigation.navigate("Checkout")} style={styles.iconBehave} >
                       <Icon name="cube" size={30} color="gray" />
                   </Pressable> */}
                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color="gray" />
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color="#FFDE9B" />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("CartScreen")} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable>

                </View>
            </View>



        </View>
        </PayPalScriptProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    heading: {
        color: COLORS.background,
        fontSize: 40,
        alignItems: 'center',
        marginBottom: 5,
    },
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: '10%',
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 50,
        bottom: 20
    },
    headerText: {
        color: COLORS.darkblue,
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
        margin: 10

    },
    Text: {
        color: COLORS.darkblue,
        fontSize: 40,
        fontWeight: "bold",
        alignItems: 'center',

    },
    address: {
        fontSize: 12,
        paddingTop: 5,
        color: COLORS.darkblue,
        paddingVertical: 10
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
    iconBehave: {
        padding: 35,
        bottom: 30
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: COLORS.grey,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerTextView: {
        backgroundColor: 'White',
        paddingVertical: 3,
    },
    smallCard: {
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        width: 80,
        margin: 10,
        height: 100
    },

    smallCardSelected: {
        borderRadius: 30,
        backgroundColor: '#FFDE9B',
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        width: 80,
        margin: 10,
        height: 100
    },

    smallCardTextSected: {
        fontWeight: "bold",
        color: '#131A2C'
    },

    smallCardText: {
        fontWeight: "bold",
        color: '#131A2C'
    },

    floatButton: {
        position: 'absolute',
        bottom: 10, right: 15,
        backgroundColor: 'white',
        elevation: 10,
        width: 60, height: 60,
        borderRadius: 30,
        alignItems: 'center'
    },


});
export default HomeScreen;