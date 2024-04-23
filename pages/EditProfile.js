import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState, useEffect } from "react";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  input,
  Dimensions,
  ScrollView,
} from "react-native";

import { sendEmailVerification } from "firebase/auth";

import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { upload, useAuth } from "../firebase";

import { auth, db, storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { render } from "react-dom";

const { width } = Dimensions.get("screen");

const EditProfile = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(false);

  const currentUser = useAuth();
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateBirth , setDateBirth] = useState(new Date());
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(true);
  const [phoneError, setPhoneError] = useState(false);
  const [countryCode, setCountryCode] = useState("+20");
  const [numberType, setNumberType] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg');
  const [validationEmail, setValidationEmail] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [countdown, setCountdown] = useState(100);
  const [fullPhoneNumber, setFullphoneNumber] = useState("");
  const [confirmPressed, setConfirmPressed] = useState(false);
  const numbers = [
    { title: '10' },
    { title: '11'},
    { title: '12'},
    { title: '15' },
  ];

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoURL(result.uri);
    }
  };
  // function handleChange(e) {
  //   if (e.target.files[0]) {
  //     setPhoto(e.target.files[0])
  //     handleChoosePhoto();
  //   }
  // };
  function handleChange(imagepath) {
    if (imagepath && imagepath.length > 0 && !imagepath.canceled) {
      const image = imagepath[0];
      setPhotoURL(imagepath.uri);
      setPhoto(imagepath);
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }

  async function upload(file, currentUser, setLoading) {
    const storage = getStorage();

    const fileRef = ref(storage,currentUser.uid + '.png');
  
    setLoading(true);
    
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
  
    updateProfile(currentUser, {photoURL});
    
    setLoading(false);
    alert("Uploaded file!");
  };


 

  const getUserData = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFristName(data.fName);
        setEmail(data.email);
        setLastName(data.lName);
        setPhone(data.phone);
        setGender(data.gender);
        setNumberType(data.numberType);
        const  dateBirth = data.dateBirth.toDate(); 
      const day = dateBirth.getDate().toString().padStart(2, "0");
      const month = (dateBirth.getMonth() + 1).toString().padStart(2, "0");
      const year = dateBirth.getFullYear().toString();
      setDateBirth(dateBirth); 
        setDay(day); 
        setMonth(month);
        setYear(year); 
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const UpdateUserData = async () => {
    const washingtonRef = doc(db, "users", auth.currentUser.uid);
console.log("iam heree");
    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      fName: fristName,
      lName: lastName,
      phone: phone,
      dateBirth: dateBirth,
      boun: bounspoint,
      countryCode:countryCode,
      fullPhoneNumber:fullPhoneNumber,
      numberType:numberType,
      gender : gender ,
      
    });
  };

  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
      return unsub;
    }, []);

    return currentUser;
  }

  useEffect(() => {
    if (currentUser) {
      getUserData(); 
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  useEffect(() => {
    // تأثير ينفذ عندما يتم الضغط على زر "Confirm"
    if (confirmPressed) {
      // دالة لتقليل قيمة العداد كل ثانية
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          // إذا وصل العداد إلى الصفر، قم بتوقيف التأثير
          if (prevCountdown <= 0) {
            clearInterval(interval);
          }
          console.log(prevCountdown); // طباعة القيمة الحالية للعداد
          return Math.max(prevCountdown - 1, 0); // ضمان عدم التجاوز للصفر
        });
      }, 1000);
  
      // قم بتنظيف المؤقت عند تفكيك المكون
      return () => clearInterval(interval);
    }
  }, [confirmPressed]);
  
  
  
  useEffect(() => {
    // عندما يكون العداد 0، قم بتعيين emailError إلى true
    if (countdown === 0) {
      setEmailError(true);
    }
  }, [countdown]);
  const handleConfirm = () => {
    // اقتران تفعيل التأثير الجانبي مع الضغط على زر "Confirm"
    setConfirmPressed(true);
  
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then(() => {
        console.log("Verification email sent");
        setEmailError(false);
        alert("Email activation email has been sent! Please check your email box.");
  
        // تأخير تحديث الرسالة بالحالة الأصلية بعد 100 ثانية
        setTimeout(() => {
          if (validationEmail !== "Email has been successfully activated!") {
            alert("Failed to send activation email. Please try again later.");
          }
        }, 100000); // 100 ثانية
      })
      .catch((error) => {
        setConfirmPressed(false);

        console.error("Error sending verification email:", error.message);
        alert("Failed to send activation email. Please try again later.");
      });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = ( event , selectedDate) => {
    const currentDate = selectedDate || dateBirth;
    setShowDatePicker(false);
    setDateBirth(currentDate);

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();

    setDay(day);
    setMonth(month);
    setYear(year);
  };
  const handleCheckEmail = () => {
    if (email.trim() === "") {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    let isvalid = true;
    let re = /\S+@\S+\.\S+/;
    if (email.trim() === "") {
      setValidationEmail("Invalid Email");
      console.log("valid");
      isvalid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationEmail("Wrong Email");
      console.log("invalid");

      isvalid = false;
    }
    if (email.trim() === "") {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    // else if ()
    if (isvalid) {
      navigation.navigate("profile");
    }
  };

  const handleSave = async () => {
    console.log("First Name:", fristName);
    console.log("Last Name:", lastName);
    console.log("Phone:", phone);
    console.log("Country Code:", countryCode);
    console.log("Number Type:", numberType);
    console.log("Gender:", gender);
    if (countdown > 0) {
      alert("Wait until the verification process is completed");

      return;
    }
  
    const currentDate = new Date();
    if (dateBirth > currentDate) {
      alert("Birthdate cannot be in the future");
      return;
    }

  
    if (fristName.trim() === "") {
      setFirstNameError(true);
      return;
    } else {
      setFirstNameError(false);
    }
  
    if (lastName.trim() === "") {
      setLastNameError(true);
      return;
    } else {
      setLastNameError(false);
    }
  
    if (phone.trim() === "") {
      setPhoneError(true);
      return;
    } else {
      setPhoneError(false);
    }
    // handleChange();
    
  
    if (!firstNameError && !lastNameError && !phoneError) {
      UpdateUserData();
      savePhoneNumberToDatabase();
      console.log("First Name:", fristName);
      console.log("Last Name:", lastName);
      console.log("Phone:", phone);
      console.log("Country Code:", countryCode);
      console.log("Number Type:", numberType);
      console.log("Gender:", gender);
      console.log("Birthdate:", dateBirth);
  
      if (loading || !photo) {
        // disable
        console.log("iam in if handle save");
      }
      else {
        handleClick();
        console.log("iam in else handle save");
      }
      

      navigation.navigate("profile");
    }
  };
  


  // دالة لإرسال رسالة التحقق عبر الهاتف
  const handleSendVerificationCode = async () => {
    const user = auth.currentUser;

    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
      await sendPhoneVerificationCode(user.fullPhoneNumber); 
      navigation.navigate("VerificationScreen"); 
    } catch (error) {
      console.error("Error sending verification code: ", error);

    }
  };
  const savePhoneNumberToDatabase = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log('iamhereee');

    if (docSnap.exists()) {

      const fullPhoneNumber = `${countryCode}${numberType}${phone}`; 
      console.log('fullphone' );
      console.log(fullPhoneNumber);
      try {
        await updateDoc(docRef, { fullPhoneNumber }); 
        console.log("Phone number updated successfully!");
      } catch (error) {
        console.error("Error updating phone number: ", error);
      }
    } else {
      console.log("No such document!");
    }
  };
 

  const handleDeleteAccount = () => {
    navigation.navigate("DeleteAccount");
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.inf}> My personal information </Text>
        <TouchableOpacity onPress={handleChoosePhoto}>
        <View>
          <Image style={styles.profileImage} source={{ uri: photoURL }} />
        </View>
      </TouchableOpacity>

        <View style={styles.inputContainer}>
          {/* frist name */}
          <View style={[{ flexDirection: "column" }]}>
            <TextInput
              style={[
                styles.input,
                { marginLeft: 5, marginRight: 5, marginTop: 20 },
              ]}
              placeholder="Frist name"
              value={fristName}
              onChangeText={(text) => setFristName(text)}
              placeholderTextColor="gray"
            />
            {firstNameError && (
              <Text style={styles.errorname}>Please enter your first name</Text>
            )}
            
          </View>
          <View style={[{ flexDirection: "column" }]}>
            <TextInput
              style={[styles.input, { marginLeft: 5, marginRight: 5 }]}
              placeholder="Last name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholderTextColor="gray"
            />
            {lastNameError && (
              <Text style={styles.errorname}>Please enter your last name</Text>
            )}
          </View>
        </View>
        <View style={styles.emailContainer}>
          <View style={[{ flexDirection: "column" }]}>
            <Text style={styles.inputLabel}> E-mail</Text>

            <TextInput
              style={[
                styles.input,
                ,
                { fontSize: 18, color: "gray", marginLeft: 5, width: 280 },
              ]}
              value={email}
              placeholder={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="gray"
              editable={false}
            />
            {emailError && (
              <Text style={styles.errorname}>Please verify your E-mail</Text>
              
            )}
             {!emailError && (
              <Text style={[styles.errorname,{color : 'green', fontSize:10}]}>Email activation email has been sent! check your E-mail box.</Text>
              
            )}
          </View>
          <View style={[{ flexDirection: "column" }]}>
                      <TouchableOpacity onPress={confirmPressed ? null : handleConfirm}>
  <Text style={[styles.confirmButton, { opacity: confirmPressed ? 0.5 : 1 }]}>Confirm</Text>
</TouchableOpacity>
{confirmPressed && (
  <Text style={{ color: 'red', textAlign: 'center', marginTop: 5 , fontSize:10}}>
  {countdown > 0 ? `Resend in ${countdown} S` : ''}
</Text>              
            )}
</View>


          {/* <TouchableOpacity onPress={confirmPressed ? handleConfirm : null }>
            <Text style={[styles.confirmButton,{ opacity: confirmPressed ? 1 : 0.5 }]}>Confirm</Text>
          </TouchableOpacity> */}

        </View>

        <View style={styles.phonecontainer}>
          <View style={styles.countryCode}>
            <TextInput
              style={styles.countrycodeinput} 
              placeholder="Country Code"
              value={countryCode}
              editable={false}
            />
          </View>
          <View style={styles.numbertypecontainer}>
          <SelectDropdown
  data={numbers}
  onSelect={(selectedItem) => {
    setNumberType(selectedItem.title);
    console.log(selectedItem.title);
  }}
  renderButton={(selectedItem , isOpened) => {
    return (
      <View style={styles.dropdownButtonStyle}>
        <Text style={styles.dropdownButtonTxtStyle}>
          {(numberType && numberType) || 'NumberType'}
        </Text>
        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
      </View>
    );
  }}
  renderItem={(item, index, isSelected) => {
    return (
      <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
      </View>
    );
  }}
  showsVerticalScrollIndicator={false}
  dropdownStyle={styles.dropdownMenuStyle}
/>


          </View>
          <View style={[styles.inputContainer, { marginTop: 4 }]}>
            <Text style={styles.inputLabel}> Phone number</Text>

            <TextInput
              style={styles.inputphone}
              value={phone}
              placeholder={phone}
              onChangeText={(text) => setPhone(text)}
              placeholderTextColor="gray"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
        </View>
        {/* borthdate container */}
        <View style={styles.birthDate}>
          {/* day  */}
          <Text style={[styles.inputLabel, { left: 10 }]}>Day</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Day"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={(text) => setDay(text)}
            value={day}
            editable={false}
          />
          {/* month */}
          <Text style={[styles.inputLabel, { left: 65 }]}> Month</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Month"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={(text) => setMonth(text)}
            value={month}
            editable={false}
          />
          {/* year*/}
          <Text style={[styles.inputLabel, { left: 125 }]}> Year</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Year"
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(text) => setYear(text)}
            value={year}
            editable={false}
          />
          <TouchableOpacity
            onPress={showDatepicker}
            style={[styles.buttonBirth]} 
          >
            <Ionicons name="calendar-outline" size={40} color="black" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={styles.dateTimePicker} 
            />
          )}
          {/* </View> */}
        </View>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={gender === "male" ? "checked" : "unchecked"}
              onPress={() => setGender("male")}
            />
            <Text style={styles.radioLabel}>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={gender === "female" ? "checked" : "unchecked"}
              onPress={() => setGender("female")}
            />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
        </View>
        {/* <TouchableOpacity onPress={handleSavesave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[styles.saveButton, { backgroundColor: "white" }]}
        >
          <Text style={[styles.saveButtonText, { color: "black" }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default EditProfile;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inf: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    // borderRadius: 75,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "gray",
    borderStyle: "outset",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  errorname: {
    color: "red",
    fontSize: 13,
    marginLeft: 5,
  },
  inputphone: {
    width: 210,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  emailContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  confirmButton: {
    textAlign: "center",
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
    width: 100,
    height: 50,
    color: "white",
    paddingTop: 15,
    marginRight: 5,
    fontSize: 17,
  },
  phonecontainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  countryCode: {
    marginLeft: 5,
    marginRight: 5,
  },

  buttonBirth: {
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
  },
  dateTimePicker: {
    backgroundColor: "gray",
    borderRadius: 5,
    marginTop: 10,
  },
  label: {
    fontSize: 20,
    marginLeft: 10,
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  numbertypecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f2f2f2",
    width: 80,
    height:45,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  inputLabel: {
    position: "absolute",
    top: 0,
    left: 5,
    color: "gray",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    width: 185,
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 0,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  countrycodeinput: {
    fontSize: 19,
    color: "gray",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
    width: 80,
    height: 45,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  firstNameInput: {
    marginRight: 5,
    marginLeft: 5,
  },
  lastNameInput: {
    marginLeft: 5,
    marginRight: 5,
  },
  birthDate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  inputDate: {
    width: 50,
    height: 40,
    borderColor: "black",
    borderBottomWidth: 1,
    color:'#2a2438',
    textAlign:'center',
    borderColor: "white",
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 10,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },

  saveButton: {
    width: 365,
    marginLeft: 15,
    backgroundColor: "black",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  labelNumber: {
    fontSize: 18,
    marginBottom: 10,
  },

  dropdownButtonStyle: {
    width: 90,
    height: 50,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    // flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#393e46',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
  },
  // dropdownButtonIconStyle: {
  //   fontSize: 18,
  //   marginRight: 8,
  // },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    // width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    fontSize: 16,
    // fontWeight: '500',
    color: '#151E26',
  },

});