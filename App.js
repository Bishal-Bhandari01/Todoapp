import React from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Colorcode = {
  textcolor: '#1f145c',
  white: '#fff',
  del: '#ff0000',
  done: '#00ff00',
  buton: '#4B0082',
};

const App = () => {

  const [textInput, setTextInput] = React.useState('');

  const [todos, settodos] = React.useState([]);

  React.useEffect(() => {
    gettodo();
  }, []);

  const gettodo = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        settodos(JSON.parse(todos));
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    safetouse(todos);
  }, [todos]);

  const safetouse = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringfyTodos);
    }
    catch (e) {
      console.log(e);
    }
  };

  const cleartodo = () => {
    Alert.alert("Confirm","Clear Todos?", [{
      text:"Yes",
      onPress: () => settodos([]),
      }, {text: "No"},
    ]);
  };
  const completetodo = todoId => {
    const newtodos = todos.map((item) => {
      if(item.id==todoId){
        return {...item,completed:true};
      }
      return item;
    });
    settodos(newtodos);
  };
  const deltodo = (todoId) => {
    const newtodos = todos.filter(item => item.id != todoId);
    settodos(newtodos);
  };

  const ListItem = ({todo}) => {
    return ( 
    <View style={styles.listItem}>
      {
        !todo?.completed && (
          <TouchableOpacity style={[styles.actionIcon1, {backgroundColor: Colorcode.done}]} onPress={()=>completetodo(todo?.id)}>
            <Entypo name="check" size={23} color={Colorcode.white} />
          </TouchableOpacity>
        )
      }
      <View style={{flex: 1}}>
        <Text style={{
          fontWeight:'bold',
          fontSize: 20,
          color: Colorcode.textcolor,
          textDecorationLine: todo?.completed?'line-through':'none',
          }}>{todo?.task}
          </Text>
      </View>
      <TouchableOpacity
       style={[styles.actionIcon2, {backgroundColor: '#FF0000'}]}
       onPress={() => deltodo(todo?.id)}>
        <Entypo name="trash" size={23} color='#fff' />
      </TouchableOpacity>
    </View>
    );
  };

  const addtodo = () => {
    if(textInput == ""){
      Alert.alert('Error','Inputing empty todo');
    }else{
      const newTodo ={
        id:Math.random(),
        task:textInput,
        completed:false,
      };
      settodos([...todos,newTodo]);
      setTextInput('');
    };
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colorcode.white,}}>
      <View style={styles.container}>
        <Text style={styles.totext}>Todo List</Text>
        <Entypo name="trash" size={25} color={Colorcode.del} onPress={cleartodo} />
      </View>
      <FlatList 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding:20, paddingBottom:100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
        />
      <View style={styles.footer}>
        <View style={styles.intputcont}>
          <TextInput
            value={textInput}
            placeholder="Add Todo" 
            onChangeText={(text) => setTextInput(text)} />
        </View>
        <TouchableOpacity onPress={addtodo}>
          <View style={styles.Iconcont}>
            <Entypo name="chevron-up" size={30} color={Colorcode.white} />
          </View>
        </TouchableOpacity>
      </View>  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  totext: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },

  actionIcon1: {
    height: 27,
    width: 27,
    marginRight: 20,
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius:3,
  },
  actionIcon2: {
    height: 27,
    width: 27,
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius:3,
  },
  listItem: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 12,
    flexDirection: 'row',
    borderRadius: 7,
    marginVertical: 10,
  },
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  intputcont:{
    backgroundColor: '#fff',
    elevation: 40,
    flex:1,
    height:50,
    marginVertical: 20,
    marginRight:20,
    borderRadius: 30,
    paddingHorizontal:20,
  },
  Iconcont: {
    height:50,
    width:50,
    backgroundColor: '#1f145c',
    borderRadius:25,
    elevation:40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;