import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [value, setValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItem.id === 1) {
      await addDoc(collection(db, 'pizza'), {
        name: name,
        description: description,
      });
    }else if (selectedItem.id === 2) {
      await addDoc(collection(db, 'burger'), {
        name: name,
        description: description,
      });
    }
    else if (selectedItem.id === 3) {
      await addDoc(collection(db, 'coffee'), {
        name: name,
        description: description,
      });
    }else {
      await addDoc(collection(db, 'offer'), {
        name: name,
        description: description,
      });
    
    }
    // if (selectedItem.label === 'pizza') {
    //   await addDoc(collection(db, "pizza"), {
    //     name: name,
    //     description: description,
    //   });
    // } else if (selectedItem.label === 'burger') {
    //   await addDoc(collection(db, "burger"), {
    //     name: name,
    //     description: description,
    //   });
    // } else if (selectedItem.label === 'coffee') {
    //   await addDoc(collection(db, "coffee"), {
    //     name: name,
    //     description: description,
    //   });
    // } else {
    //   await addDoc(collection(db, "offer"), {
    //     name: name,
    //     description: description,
    //   });
    // }


  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // const menuItems = [
  //   { id: 1, label: 'Pizza' },
  //   { id: 2, label: 'Burger' },
  //   { id: 3, label: 'Coffee' },
  //   { id: 3, label: 'Offer' },
  // ];
  const items = [

    { label: 'Pizza', value: 'Pizza' },
    { label: 'Burger', value: 'Burger' },
    { label: 'Coffee', value: 'Coffe' },
    { label: 'Offer', value: 'Offer' },
  
];

  const handlePress = async(item) => {
    setSelectedItem(item);
   
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline={true} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image:</Text>
          <TouchableOpacity style={styles.fileInput} onPress={handleImageUpload}>
            <Text style={styles.fileInputText}>Choose File</Text>
          </TouchableOpacity>
        </View>
         {/*\<View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        {selectedItem && (
          <Text>You selected {selectedItem.label}</Text>
        )}
      </View> */}
      <view>
        <DropDownPicker
        items={items}
        open={isOpen}
        setOpen={() => setIsOpen(!isOpen)}
        value={selectedItem}
        setValue={(val)=> setSelectedItem(val)}
        placeholder="Choose category"
        placeholderStyle ={{color : "" ,fontSize :16}}
        // renderItem={renderItem}
        // keyExtractor={(item) => item.id.toString()}
      
        />
        {selectedItem && (
              <Text>You selected {selectedItem.id}</Text>
            )}
      </view>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5F5F5',
  paddingHorizontal: 20,
  },
  form: {
    height : "50%",
  width: '100%',
  backgroundColor: '#FFF',
  paddingVertical: 20,
  paddingHorizontal: 15,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  },
  inputContainer: {
  marginBottom: 10,
  },
  label: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
  },
  input: {
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontSize: 16,
  },
  button: {
  backgroundColor: "#131A2C",
  borderRadius: 5,
  paddingHorizontal: 20,
  paddingVertical: 10,
  alignItems: 'center',
  marginTop: 30,
  },
  buttonText: {
  color: '#FFDE9B',
  fontSize: 18,
  fontWeight: 'bold',
  },
  imageContainer: {
  alignItems: 'center',
  marginBottom: 10,
  },
  imagePreview: {
  width: 200,
  height: 200,
  borderRadius: 5,
  marginBottom: 5,
  },
  listContainer: {
  marginTop: 20,
  },
  listItem: {
  padding: 10,
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 5,
  marginBottom: 10,
  },
  selectedItem: {
  backgroundColor: '#000',
  color: '#FFF',
  },
  fileInputText: {
    fontSize: "18px",
  },
  menuContainer: {
    width: 200,
    // marginBottom: 50,
    fontWeight: "bold",
    fontSize: "20px",
    color: "#131A2C",
  },
  TextC: {
    fontSize: "20px",
  },
  });


export default AddProductForm;
