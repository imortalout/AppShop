import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as Font from 'expo-font'
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight, Button, KeyboardAvoidingView, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Spinner from 'react-native-loading-spinner-overlay'
import Toast, {DURATION} from 'react-native-easy-toast'

import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCaMf5vapFrgFUslZmz5BIIF1LL3NrNUEI",
    authDomain: "appshopper-92ab0.firebaseapp.com",
    databaseURL: "https://appshopper-92ab0.firebaseio.com",
    projectId: "appshopper-92ab0",
    storageBucket: "appshopper-92ab0.appspot.com",
    messagingSenderId: "177017143145",
    appId: "1:177017143145:web:e48ffe7a7e6d7e66ec87f8",
    measurementId: "G-2EBRNZE90E"
}
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

var colors = {
  primary: '#1EA7DB',
  secondary: '#3E4148',
  secondaryOp: 'rgba(62, 65, 72, 0.6)',
  white: '#FFF'
}


class SignUpScreen extends React.Component {
  render(){
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Sign Up Screen</Text>
        <Button title="Go back" onPress={() => this.props.navigation.goBack()} />
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  render(){
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>HomeScreen</Text>
        <Button title="Go back" onPress={() => this.props.navigation.goBack()} />
      </View>
    )
  }
}


class LoginScreen extends React.Component {

  constructor(props){
    super(props)

    this.login = this.login.bind(this)
  }

  state = {
    fontLoaded: false,
    loading: false,
  }

   async componentWillMount() {

      await Font.loadAsync({
          'ubuntuMedium': require('./assets/fonts/Ubuntu-Medium.ttf'),
          'ubuntuRegular': require('./assets/fonts/Ubuntu-Regular.ttf'),
      })

      this.setState({
          fontLoaded: true,
      })
  }

  login(){

    this.setState({loading: true})

    const { emailInput , passwordInput } = this.state

    var refThis = this

    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
    .then(function(result) {

        refThis.refs.toast.show('Logado com Sucesso') 
        refThis.props.navigation.navigate('Home')
        refThis.setState({loading: false})
    
    }).catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message  

        var error = refThis.checkError(errorCode)

        refThis.refs.toast.show(error)   

        refThis.setState({
            loading: false
        })
    })
  }

  checkError(code){
      switch(code) {
        case 'auth/email-already-in-use':
          return 'Email está em Uso'
          break;
        case 'auth/invalid-email':
          return 'Email Mal Formatado'
          break;
        case 'auth/weak-password':
          return 'Senha Fraca'  
          break;
        case 'auth/wrong-password':
          return 'Errou a Senha'
        case 'auth/user-not-found':
          return 'Email não Encontrado'
        default:
          return 'Algo Deu Errado!'
      }
  }

  render(){

    var { loading, fontLoaded, emailInput, passwordInput } = this.state

    return(
    <ScrollView contentContainerStyle={loginstyles.container} keyboardShouldPersistTaps='handled'>
        <StatusBar style="auto" />
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{width: '100%', justifyContent: 'space-between', height: '100%'}}
          >
        <View style={loginstyles.header}>
          <Image
          style={loginstyles.logo}
          source={require('./assets/logo.png')}
          />  
        </View>
        
        <View style={loginstyles.login}>
        
          {fontLoaded ? (
            <TextInput
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({emailInput: text})
            }}
            style={loginstyles.input}
            textAlignVertical='top'
            value={emailInput}
            editable={true}
            paddingLeft={8}
            placeholder="EMAIL"
            placeholderTextColor={colors.secondaryOp}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.senha.focus(); }}
            blurOnSubmit={false}
          />
            ) : null}
          <View style={loginstyles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.senha = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({passwordInput: text})
            }}
            style={loginstyles.input}
            textAlignVertical='top'
            value={passwordInput}
            editable={true}
            paddingLeft={8}
            placeholder="SENHA"
            placeholderTextColor={colors.secondaryOp}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.login(); }}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
            ) : null}

          <View style={loginstyles.separator}></View>
          <View style={loginstyles.viewButton}>
            {fontLoaded ? (<Text style={loginstyles.loginText}>Login</Text>) : null }
            <TouchableHighlight style={loginstyles.buttonLogin} onPress={() => this.login()}>
              <Icon name="arrow-right" color={colors.white} size={24}/> 
            </TouchableHighlight>
          </View>
          <View style={loginstyles.bottomButtons}>
            {fontLoaded ? (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={loginstyles.create}>Criar Conta</Text>
            </TouchableHighlight>
              ) : null }
            {fontLoaded ? (
            <TouchableHighlight  onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={loginstyles.create}>Esqueceu Senha</Text>
            </TouchableHighlight>
              ) : null }
          </View>
        </View>
        </KeyboardAvoidingView>
        <Spinner
          visible={loading}
        /> 
        <Toast 
          ref="toast"
          style={{backgroundColor:'#000', zIndex: 10}}
          position='top'
          positionValue={200}
          fadeInDuration={1750}
          fadeOutDuration={1500}
          opacity={0.8}
          textStyle={{color: '#FFF'}}
          />
      </ScrollView>
      )
  }
}

const Stack = createStackNavigator();

export default class App extends React.Component {

  constructor(props){
    super(props)

    console.disableYellowBox = true
  }

  render(){

    return (
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }
}

const loginstyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  header : {
    height: 220,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingTop: 20,
  },
  logo : {
    height: 120
  },
  login: {
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    paddingTop: 20,
  },
  input : {
    color: colors.secondary,
    fontFamily: 'ubuntuMedium', 
    fontSize: 16
  },
  separator : {
    marginBottom: 36,
    marginTop: 16,
    width: '100%',
    height: 1,
    backgroundColor: colors.secondaryOp
  },
  viewButton : {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  loginText : {
    fontSize: 26,
    marginLeft: 6,
    fontFamily: 'ubuntuMedium',
    color: colors.secondary 
  },
  buttonLogin : {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 30
  },
  bottomButtons : {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 60
  },
  create : {
    fontSize: 16,
    fontFamily: 'ubuntuMedium',
    color: colors.secondaryOp
  }
});
