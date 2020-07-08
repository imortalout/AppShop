import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as Font from 'expo-font'
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight, Button, KeyboardAvoidingView, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Spinner from 'react-native-loading-spinner-overlay'
import Toast, {DURATION} from 'react-native-easy-toast'

import DateTimePickerModal from "react-native-modal-datetime-picker"

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

// Login Teste
// teste@teste.com[Email]
// 123456789[Senha]

var colors = {
  primary: '#1EA7DB',
  secondary: '#3E4148',
  secondaryOp: 'rgba(62, 65, 72, 0.6)',
  white: '#FFF'
}

function checkError(code){
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


class SignUpScreen extends React.Component {

  state = {
    fontLoaded: false,
    loading: false,
    date: false,
    dateText: 'DATA DE NASCIMENTO',
    time: null,
    loading: false,
  }

  constructor(props){
    super(props)

    this._handleConfirm = this._handleConfirm.bind(this)
    this._hideDate = this._hideDate.bind(this)
    this._openDate = this._openDate.bind(this)
    this._signUp = this._signUp.bind(this)
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

  _handleConfirm(date){
    console.log(date)

     var time = date.getTime()

     function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp)
      var year = a.getFullYear()
      var month = a.getMonth()
      var date = a.getDate()
      month = month + 1

      if(date < 10){
        date = '0' + date 
      }
      if(month < 10){
        month = '0' + month 
      }

      var time = date + '/' + month + '/' + year 
      return time;
    }

    var timeShow = timeConverter(time)
    

    this.setState({
        date: false,
        dateText: timeShow,
        time: time
    })
  }

  _hideDate(){
    this.setState({
        date: false
    })
  }

  _openDate(){
    this.setState({
        date: true
    })
  }

  _signUp(){

    var { emailInput, passwordInput, nameInput, time } = this.state

    this.setState({loading: true})

    var refThis = this

    if(nameInput != null && emailInput != null && passwordInput != null || time != null ){
      firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).then(function(user) {

          refThis.refs.toast.show('Criado com Sucesso!')
          refThis.setState({loading: false})

          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              var refBase = firebase.database().ref('users/' + user.uid + '/profile')
              user.updateProfile({
                  displayName: nameInput,
                }).then(function(){
                refBase.set({
                  name: nameInput,
                  email: emailInput,
                  date: time
                }).then(function() {
                  refThis.props.navigation.navigate('Home')
                })
              })
            }
          })
      }, function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          var error = checkError(errorCode)

          refThis.refs.toast.show(error)
          refThis.setState({
              animeSign: false
          })
      })
    } else {

    }
  }

  render(){

    var  { fontLoaded, date, emailInput, passwordInput, nameInput, dateText, loading } =  this.state

    return (
      <ScrollView contentContainerStyle={signstyles.view} keyboardShouldPersistTaps='handled'>
        <StatusBar style="dark" />
        <View style={signstyles.header}>
          <TouchableHighlight onPress={() => this.props.navigation.goBack()} style={signstyles.buttonBack}>
            <Icon name="chevron-left" color={colors.secondary} size={30}/> 
          </TouchableHighlight>
          {fontLoaded ? (<Text style={signstyles.title}>Criar Conta</Text>) : null }
        </View>
        <View style={signstyles.form}>
           {fontLoaded ? (
            <TextInput
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({nameInput: text})
            }}
            style={signstyles.input}
            textAlignVertical='top'
            value={nameInput}
            editable={true}
            paddingLeft={8}
            placeholder="NOME"
            placeholderTextColor={colors.white}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.setState({date: true}) }}
            blurOnSubmit={false}
          />
            ) : null}
           <View style={signstyles.separator}></View>
           <TouchableHighlight onPress={() => this._openDate()}>
            <Text style={signstyles.date} >{dateText}</Text>
          </TouchableHighlight>
          <View style={signstyles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.email = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({emailInput: text})
            }}
            style={signstyles.input}
            textAlignVertical='top'
            value={emailInput}
            editable={true}
            paddingLeft={8}
            placeholder="EMAIL"
            placeholderTextColor={colors.white}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.senha.focus(); }}
            blurOnSubmit={false}
          />
            ) : null}
          <View style={signstyles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.senha = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({passwordInput: text})
            }}
            style={signstyles.input}
            textAlignVertical='top'
            value={passwordInput}
            editable={true}
            paddingLeft={8}
            placeholder="SENHA"
            placeholderTextColor={colors.white}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this._signUp() }}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
            ) : null}
          <View style={signstyles.separator}></View>
          <DateTimePickerModal
                isVisible={date}
                mode="date"
                onConfirm={this._handleConfirm}
                onCancel={this._hideDate}
                headerTextIOS="Escolha as Horas"
                confirmTextIOS="Confirmar"
                cancelTextIOS="Cancelar"
              />
              <View style={loginstyles.viewButton}>
            {fontLoaded ? (<Text style={signstyles.loginText}>Inscrever-se</Text>) : null }
            <TouchableHighlight style={signstyles.buttonLogin} onPress={() => this._signUp()}>
              <Icon name="arrow-right" color={colors.secondary} size={24}/> 
            </TouchableHighlight>
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
          </View>
        </View>
      </ScrollView>
    )
  }
}

const signstyles = StyleSheet.create({
  view: {
    width: '100%',
    backgroundColor: colors.primary,
    height: '100%',
  },
  header: {
    paddingTop: 40,
    paddingLeft: 20,
    paddingBottom: 30,
    backgroundColor: colors.white
  },
  buttonBack : {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    color: colors.secondary,
    marginTop: 20,
    fontFamily: 'ubuntuMedium',
  },
  form: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 60,
    paddingLeft: 20,
    paddingRight: 20
  },
  input : {
    color: colors.white,
    fontFamily: 'ubuntuMedium', 
    fontSize: 16,
    paddingTop: 8,
    marginTop: 20,
    paddingBottom: 18,
  },
  separator : {
    width: '100%',
    height: 1,
    backgroundColor: colors.white
  },
  date : {
    color: colors.white,
    fontFamily: 'ubuntuMedium', 
    fontSize: 16,
    marginLeft: 4,
    paddingTop: 8,
    marginTop: 20,
    paddingBottom: 18,
  },
  loginText : {
    fontSize: 26,
    marginLeft: 6,
    fontFamily: 'ubuntuMedium',
    color: colors.white 
  },
  buttonLogin : {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 30
  },
})

class HomeScreen extends React.Component {

  state = {
    fontLoaded: false,
    nameUser: '',
    userInfo: null
  }

  constructor(props){
    super(props)
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


  componentDidMount(){

    var refThis = this

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var refUser = firebase.database().ref('users/' + user.uid + '/profile') 
        refUser.once('value', function(snapshot){
          var value = snapshot.val()
          console.log(value)
          if(value){
            var name = value.name
            var nameNow = name.split(' ')

            refThis.setState({
              nameUser: nameNow[0]
            })
          }
        })   
      } else {
        refThis.props.navigation.navigate('Login')
      }
    })

    
  }


  render(){

    var { nameUser, fontLoaded } =  this.state

    return (
      <View style={homestyles.view}>
        <StatusBar style="dark" />
        <View style={homestyles.header}>
          {fontLoaded ? (<Text style={homestyles.title}>Olá, {nameUser}</Text>): null}
          <Icon name="user" color={colors.white} size={24}/> 
        </View>
        <Button title="Go back" onPress={() => this.props.navigation.goBack()} />
        <Button title="Logout" onPress={() => {
          firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
        }} />
      </View>
    )
  }
}

const homestyles = StyleSheet.create({
  view : {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  header : {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'ubuntuMedium',
  }
})


class LoginScreen extends React.Component {

  constructor(props){
    super(props)

    this.login = this.login.bind(this)
  }

  state = {
    fontLoaded: false,
    loading: false,
  }

  componentDidMount(){

    var refThis = this

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
         refThis.props.navigation.navigate('Home')
      }
    })
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
        refThis.setState({loading: false})
        refThis.props.navigation.navigate('Home')
    
    }).catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message  

        var error = checkError(errorCode)

        refThis.refs.toast.show(error)   

        refThis.setState({
            loading: false
        })
    })
  }

  

  render(){

    var { loading, fontLoaded, emailInput, passwordInput } = this.state

    return(
    <ScrollView contentContainerStyle={loginstyles.container} keyboardShouldPersistTaps='handled'>
        <StatusBar style="light" />
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={loginstyles.keyboard}
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

const loginstyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  keyboard : {
    width: '100%', 
    justifyContent: 'space-between', 
    height: '100%'
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
    color: colors.secondaryOp,
  }
});

const Stack = createStackNavigator();

export default class App extends React.Component {

  constructor(props){
    super(props)

    console.disableYellowBox = true
  }


  render(){

    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}> 
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }
}
