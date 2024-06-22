import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { filterOrder } from "../../data";
import {
  doc,
  collection,
  where,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { isCancel } from "axios";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;

const HistoryOrder = ({ navigation }) => {
  const [OrderList, setOrderList] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    getOrders();
    handleShowButton();
  }, []);

  const getOrders = async () => {
    try {

      const userId = await AsyncStorage.getItem("USERID");
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      console.log(userData);
      const userOrders = userData.HistoryOrder || [];

      setOrderList(userOrders);
      console.log(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (timestamp) => {

    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {

      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    return "Invalid Date";
  };

  const deleteAddress = (index) => {
    const updatedHistoryOrder = OrderList.filter((_, i) => i !== index);
    setOrderList(updatedHistoryOrder);
  };
  const isWithin24Hours = (timestamp) => {
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      const orderDate = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
      const now = new Date();
      const twentyFourHoursAgo = new Date(now);
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      return orderDate > twentyFourHoursAgo;
    }
    return false;
  };

  const handleShowButton = (timestamp) => {
    return isWithin24Hours(timestamp);
  };

  const handleCancel = async (index) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("userData", userData);
        const currentWalletAmount = userData.walet || 0;
        const refundedAmount = parseFloat(
          userData.HistoryOrder[index].totalPrice
        );

        const updatedWalletAmount = currentWalletAmount + refundedAmount;
        await updateDoc(userDocRef, { walet: updatedWalletAmount });
        console.log("Wallet value updated after refund:", updatedWalletAmount);
        const cancelOrders = userData.cancelOrder || [];
        const currentOrders = userData.HistoryOrder || [];
        const selectedProduct = currentOrders[index];
        if (!cancelOrders.includes(selectedProduct)) {
          await updateDoc(userDocRef, {
            cancelOrder: [...cancelOrders, selectedProduct],
          });
        }

        let updatedHistoryOrder = userData.HistoryOrder.filter(
          (item, i) => i !== index
        );

        updatedHistoryOrder = updatedHistoryOrder.map((item, i) => ({
          ...item,
          index: i,
        }));

        await updateDoc(userDocRef, { HistoryOrder: updatedHistoryOrder });

        alert("Order deleted successfully");
        deleteAddress(index);
      } else {
        alert("No user data found");
      }
    } catch (error) {
      console.error("Error deleting Order:", error);
    }
  };

  console.log(OrderList);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filterOrder}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate(item.name)}>
              <View
                style={
                  item.name === "HistoryOrder"
                    ? { ...styles.smallCardSelected }
                    : { ...styles.smallCard }
                }
              >
                <View style={styles.smallCardText}>
                  <Text
                    style={
                      item.name === "HistoryOrder"
                        ? { ...styles.boldText }
                        : { ...styles.regularText }
                    }
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
      <View style={styles.containeritem}>
        <FlatList
          style={styles.container}
          data={OrderList}
          keyExtractor={(item) => item.index}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              </View>
              <View style={styles.textContainer}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    Date: {formatDate(item.timestamp)}
                  </Text>
                </View>
                <Text style={styles.itemText}>Name: {item.Name}</Text>
                <Text style={styles.itemText}>size: {item.size}</Text>
                <Text style={styles.itemText}>quantity: {item.quantity}</Text>
                <Text style={styles.itemText}>
                  totalPrice: {item.totalPrice}
                </Text>
                {show && (
                  <View
                    style={[
                      {
                        justifyContent: "flex-end",
                        position: "absolute",
                        bottom: 5,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleCancel(item.index)}
                      style={[
                        styles.logoutButton,
                        !handleShowButton(item.timestamp) && {
                          display: "none",
                        },
                      ]}
                    >
                      <Text style={styles.logoutButtonText}>CancelOrder</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containeritem: {
    backgroundColor: "white",
    width: width,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 70,
  },
  smallCard: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: width / 2,
    height: 70,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
  },
  smallCardSelected: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: width / 2,
    height: 70,
    shadowColor: "black",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  smallCardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  smallCardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  regularText: {
    fontWeight: "normal",
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: " black",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    width: width,
    height: height / 4.8,
  },
  imageContainer: {
    marginRight: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  itemImage: {
    width: cardwidth - 100,
    height: height / 5.4,
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    flexWrap: "wrap",
    width: "100%",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginRight: 10,
    textAlign: "left",
    flexWrap: "wrap",
    width: "70%",
  },
  dateText: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 0,
  },
  dateContainer: {
    alignItems: "flex-end",
    flexWrap: "wrap",
    width: "70%",
  },
  logoutButton: {
    justifyContent: "center",
    width: cardwidth,
    height: cardwidth - 160,
    marginLeft: 35,
    backgroundColor: "black",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default HistoryOrder;
