import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as Font from 'expo-font'
import { Dimensions, StyleSheet, Text, View, Image, TextInput, TouchableHighlight, Button, KeyboardAvoidingView, ScrollView, FlatList, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Spinner from 'react-native-loading-spinner-overlay'
import Toast, {DURATION} from 'react-native-easy-toast'

import DateTimePickerModal from "react-native-modal-datetime-picker"

import firebase from 'firebase'

import _ from 'lodash'

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Login Teste
// teste@teste.com[Email]
// 123456789[Senha]

var colors = {
  primary: '#E91313',
  secondary: '#3E4148',
  secondaryOp: 'rgba(62, 65, 72, 0.6)',
  white: '#FFF',
  background: '#E7ECFA',
  alert: '#E71515'
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
      case 'auth/requires-recent-login':
        return 'Precisa Fazer Login'
      default:
        return 'Algo Deu Errado!'
    }
}

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

class PerfilScreen extends React.Component {

  state = {
    fontLoaded: false,
    loading: false,
    date: false,
    dateText: 'DATA DE NASCIMENTO',
    time: null,
    loading: false,
    nameNow: '',
    timeNow: '',
    emailNow: '',
  }

  constructor(props){
    super(props)

    this.handleConfirm = this.handleConfirm.bind(this)
    this.hideDate = this.hideDate.bind(this)
    this.openDate = this.openDate.bind(this)
    this.signUp = this.signUp.bind(this)
    this.save = this.save.bind(this)
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

    var user = firebase.auth().currentUser

    
      if(user){
        var refProfile = firebase.database().ref('users/' + user.uid +  '/profile')
        refProfile.on('value', function(snapshot){
          var value = snapshot.val()

          if(value){

            var timeShow = timeConverter(value.date)

            refThis.setState({
              emailInput: value.email,
              nameInput: value.name,
              dateText: timeShow,
              nameNow: value.name,
              timeNow: timeShow,
              emailNow: value.email,
              time: timeShow
            })
          } 
        })
      }

    firebase.auth().onAuthStateChanged(function(user) {
      if(!user){
        refThis.props.navigation.navigate('Login')
      }
    })


  }

  handleConfirm(date){

    var time = date.getTime()
    var timeShow = timeConverter(time)

    this.setState({
        date: false,
        dateText: timeShow,
        time: time
    })
  }

  hideDate(){
    this.setState({date: false})
  }

  openDate(){
    this.setState({date: true})
  }

  signUp(){

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
    }
  }

  logout(){
    firebase.auth().signOut().then(function() {
        refThis.props.navigation.navigate('Login')
      }).catch(function(error) {
        // An error happened.
      });
  }

  save(){

    var { emailInput, passwordInput, time, nameInput, nameNow, emailNow, dateNow, timeNow } = this.state

    var refThis = this

    var user = firebase.auth().currentUser

    if(nameInput != nameNow){

      if(user){
        var refName = firebase.database().ref('users/' + user.uid + '/profile/name')
        refName.set(nameInput).then(function() {
          user.updateProfile({displayName: nameInput}).then(function(){
            refThis.refs.toast.show('Nome Modificado!')
          })
        })
      }
    } 

    if(time != timeNow){

      if(user){
        var refTime = firebase.database().ref('users/' + user.uid + '/profile/date')
        refTime.set(time).then(function(){
          refThis.refs.toast.show('Data Modificada!')
        })
      }
    }

    if(emailInput != emailNow){

      if(passwordInput){
        if(user){
        firebase.auth().signInWithEmailAndPassword(emailNow, passwordInput)
        .then(function(result) {
          user.updateEmail(emailInput).then(function() {
          // Update successful.
            var refEmail = firebase.database().ref('users/' + user.uid + '/profile/email')
            refEmail.set(emailInput).then(function(){
              refThis.refs.toast.show('Email Modificado!')
            })
          }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            var error = checkError(errorCode)

            refThis.refs.toast.show(error)
          });
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
      } else {
        refThis.refs.toast.show('Necessita Senha!')
      }
    }
  }

  render(){

    var  { fontLoaded, date, emailInput, passwordInput, nameInput, dateText, loading } =  this.state

    return (
      <ScrollView contentContainerStyle={perfilstyles.view} keyboardShouldPersistTaps='handled'>
        <StatusBar style="light" />
        <View style={perfilstyles.header}>
          <TouchableHighlight onPress={() => this.props.navigation.goBack()} style={perfilstyles.buttonBack}>
            <Icon name="chevron-left" color={colors.white} size={30}/> 
          </TouchableHighlight>
          {fontLoaded ? (<Text style={perfilstyles.title}>Perfil</Text>) : null }
        </View>
        <View style={perfilstyles.form}>
           {fontLoaded ? (
            <TextInput
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({nameInput: text})
            }}
            style={perfilstyles.input}
            textAlignVertical='top'
            value={nameInput}
            editable={true}
            paddingLeft={8}
            placeholder="NOME"
            placeholderTextColor={colors.secondaryOp}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.setState({date: true}) }}
            blurOnSubmit={false}
          />
            ) : null}
           <View style={perfilstyles.separator}></View>
           <TouchableHighlight onPress={() => this.openDate()}>
            <Text style={perfilstyles.date} >{dateText}</Text>
          </TouchableHighlight>
          <View style={perfilstyles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.email = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({emailInput: text})
            }}
            style={perfilstyles.input}
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
          <View style={perfilstyles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.senha = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({passwordInput: text})
            }}
            style={perfilstyles.input}
            textAlignVertical='top'
            value={passwordInput}
            editable={true}
            paddingLeft={8}
            placeholder="SENHA"
            placeholderTextColor={colors.secondaryOp}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.save() }}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
            ) : null}
          <View style={perfilstyles.separator}></View>
          <DateTimePickerModal
                isVisible={date}
                mode="date"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDate}
                headerTextIOS="Escolha as Horas"
                confirmTextIOS="Confirmar"
                cancelTextIOS="Cancelar"
              />
              <View style={loginstyles.viewButton}>
            <View style={perfilstyles.optionsBottom}>
              {fontLoaded ? (<Text style={perfilstyles.loginText}>Salvar</Text>) : null }
              <TouchableHighlight style={perfilstyles.buttonLogin} onPress={() => this.save()}>
                <Icon name="save" color={colors.white} size={24}/> 
              </TouchableHighlight>
            </View>
          </View>
          <TouchableHighlight style={perfilstyles.leaveButton} onPress={() => this.logout()}>
              <Text style={perfilstyles.leave}>Sair</Text> 
          </TouchableHighlight>
        </View>
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

const perfilstyles = StyleSheet.create({
  view: {
    width: '100%',
    backgroundColor: colors.white,
    height: '100%',
  },
  header: {
    paddingTop: 40,
    paddingLeft: 20,
    paddingBottom: 30,
    backgroundColor: colors.primary
  },
  buttonBack : {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    color: colors.white,
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
    color: colors.secondary,
    fontFamily: 'ubuntuMedium', 
    fontSize: 16,
    paddingTop: 8,
    marginTop: 20,
    paddingBottom: 18,
  },
  separator : {
    width: '100%',
    height: 1,
    backgroundColor: colors.secondaryOp
  },
  date : {
    color: colors.secondary,
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
    color: colors.secondary 
  },
  buttonLogin : {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30
  },
  leaveButton : {
    marginTop: 30,
    alignItems: 'flex-start'
  },
  leave : {
    color: 'red',
    fontSize: 20,
    marginLeft: 4,
    textAlign: 'left',
    alignSelf: 'stretch',
    fontFamily: 'ubuntuMedium'
  },
  optionsBottom : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  }
})


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

    this.handleConfirm = this.handleConfirm.bind(this)
    this.hideDate = this.hideDate.bind(this)
    this.openDate = this.openDate.bind(this)
    this.signUp = this.signUp.bind(this)
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

  handleConfirm(date){

    var time = date.getTime()
    var timeShow = timeConverter(time)
    

    this.setState({
        date: false,
        dateText: timeShow,
        time: time
    })
  }

  hideDate(){
    this.setState({date: false})
  }

  openDate(){
    this.setState({date: true})
  }

  signUp(){

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
           <TouchableHighlight onPress={() => this.openDate()}>
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
            onSubmitEditing={() => { this.signUp() }}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
            ) : null}
          <View style={signstyles.separator}></View>
          <DateTimePickerModal
                isVisible={date}
                mode="date"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDate}
                headerTextIOS="Escolha as Horas"
                confirmTextIOS="Confirmar"
                cancelTextIOS="Cancelar"
              />
              <View style={loginstyles.viewButton}>
            {fontLoaded ? (<Text style={signstyles.loginText}>Inscrever-se</Text>) : null }
            <TouchableHighlight style={signstyles.buttonLogin} onPress={() => this.signUp()}>
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
    userInfo: null,
    products: null,
    fullProducst: [],
    searchInput: '',
    refresh: false,
    favo: false
  }

  constructor(props){
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.getList = this.getList.bind(this)
    this.switchFavo = this.switchFavo.bind(this)
    this.logout = this.logout.bind(this)
    this.getProductsOff = this.getProductsOff.bind(this)
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

    var user = firebase.auth().currentUser
    
    if (user) {
      // User is signed in.
      var refUser = firebase.database().ref('users/' + user.uid + '/profile') 
      refUser.on('value', function(snapshot){
        var value = snapshot.val()

        if(value){
          var name = value.name
          var nameNow = name.split(' ')

          refThis.setState({
            nameUser: nameNow[0]
          })
        } 
      })   
    }


    // refThis.getProductsOff()
    
    setTimeout(function () {  
      var products = refThis.state.products
      if(!products){
        refThis.getProductsOff()
      }
    }, 6000)

    this.getList(false)
  }

  getList(star){

    var refThis = this

    var refList = firebase.database().ref('products')
    refList.once('value', function(snapshot){
      var value = snapshot.val()
      var array = []

      for (variavel in value) {
        var valueNow = value[variavel]
        valueNow.key = variavel
        valueNow.star = false
        array.push(valueNow)
      }

      var user = firebase.auth().currentUser

      if(user){
        var refData = firebase.database().ref('users/' + user.uid + '/profile/favorites')
        refData.on('value', function(snapshot){
          var favo = snapshot.val()

          for(variavel in array){
                var produ = array[variavel]
                array[variavel].star = false
              }

          if(favo){
            for (variavel in favo) {
              var key = variavel
              
              for(variavel in array){
                var produ = array[variavel]
                if(produ.key === key){
                  array[variavel].star = true
                }
              }
            }
          }
        })
      }

      var newArray = []

      for(variavel in array){
        var produ = array[variavel]
        if(star){
          if(produ.star === true){
            newArray.push(produ)
          }
        }else {
          newArray.push(produ)
        }
      }

      refThis.setState({
        products: newArray,
        fullProducst: array,
        refresh: false,
      })
  
      const jsonValue = JSON.stringify(newArray)
      AsyncStorage.setItem('products', jsonValue)
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


  async getProductsOff(){

    var refThis = this

    try {
      let products = await AsyncStorage.getItem('products')

      var newProducts = JSON.parse(products)
      var array = []
      for (var i = 0 ; i < newProducts.length; i++) {
        var product = newProducts[i]
        array.push(product)
      }

      refThis.setState({
        products: array
      })

    } catch (error) {
    }
  }


  handleSearch(text){

    const formatQuery = text.toLowerCase();

    const fullData = this.state.fullProducst

    const data = _.filter(fullData, objeto => {

      var name = objeto.name.toLowerCase();

      if(name.includes(formatQuery)){
        return true
      } 
      return false
    })

    this.setState({
      products: data
    })
  }

  logout(){

      console.log('called')
     firebase.auth().signOut().then(function() {
        // Sign-out successful.
        refThis.props.navigation.navigate('Login')
      }).catch(function(error) {
        // An error happened.
      });
  }

  onRefresh(){

    this.setState({
      refresh: true,
      products: [],
    })  

    var start = this.state.favo

    this.getList(start)
  }

  star(product){

    var user = firebase.auth().currentUser

    if(!product.star){
      if(user){
        var productStar = firebase.database().ref('users/' + user.uid + '/profile/favorites/'+ product.key)
        productStar.set('true')
      }
    } else {
      var productStar = firebase.database().ref('users/' + user.uid + '/profile/favorites/' + product.key)
      productStar.remove()
    }
  }

  switchFavo(favo){
    this.setState({favo: favo})
    this.getList(favo)
  }


  render(){

    var { nameUser, fontLoaded, products, searchInput, refresh, favo } =  this.state

    return (
    <ScrollView contentContainerStyle={homestyles.container} keyboardShouldPersistTaps='handled' scrollEnabled={false}>
      <View style={homestyles.view}>
        <StatusBar style="dark" />
        <View style={homestyles.header}>
          {fontLoaded ? (<Text style={homestyles.title}>Olá, {nameUser}</Text>): null}
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Perfil')} stlye={homestyles.perfil}>
            <Icon name="user" color={colors.white} size={20}/>   
          </TouchableHighlight>
        </View>
        <View style={homestyles.optionsView}>
          {fontLoaded ? (<Text style={homestyles.search}>Produtos</Text>): null}  
          <View style={homestyles.switchView}>
              <TouchableHighlight  onPress={() => this.switchFavo(false) }>  
                { favo ? (<Text style={homestyles.optionsFalse}>Todos</Text>) : (<Text style={homestyles.options}>Todos</Text>)}
              </TouchableHighlight>
              <TouchableHighlight  onPress={() => this.switchFavo(true)}>  
                {favo ? (<Text style={homestyles.options}>Favoritos</Text>) : (<Text style={homestyles.optionsFalse}>Favoritos</Text>)}
              </TouchableHighlight>
          </View>
        </View>
        
        {fontLoaded ? (
            <View style={homestyles.searchView}>
              <Icon name="search" color={colors.secondary} size={20}/> 
              <TextInput
                ref={(input) => { this.senha = input}}
                keyboardType="default"
                autoCapitalize='none'
                underlineColorAndroid="transparent"
                onChangeText={(text) => {
                  this.handleSearch(text)
                  this.setState({searchInput: text})
                }}
                style={homestyles.input}
                textAlignVertical='top'
                value={searchInput}
                editable={true}
                paddingLeft={8}
                placeholder="Buscar..."
                placeholderTextColor={colors.secondaryOp}
                keyboardAppearance="dark"
                onSubmitEditing={() => { this._signUp() }}
                blurOnSubmit={false}
            />
          </View>
            ) : null}
        <FlatList
          data={products}
          onRefresh={() => this.onRefresh()}
          style={homestyles.list}
          refreshing={refresh}
          renderItem={({ item }) => (
              <View style={homestyles.cell}>
                  <Image
                      source={{uri: item.photo}}
                      style={homestyles.imageCell}
                      resizeMode='cover'
                      borderRadius={8}
                  />
                  <View style={homestyles.cellText}>
                    <Text style={homestyles.cellTitle}>{item.name}</Text>  
                    <Text style={homestyles.cellSubTitle}>{item.desc}</Text>  
                  </View>
                  <TouchableHighlight onPress={() => this.star(item)} style={homestyles.star}>
                    {item.star ? (
                      <Image
                        source={{uri: 'https://firebasestorage.googleapis.com/v0/b/appshopper-92ab0.appspot.com/o/star.png?alt=media&token=7376b812-59e6-44f0-b070-9755ccedd653'}}
                        style={{width: 18, height: 18}}
                        resizeMode='cover'
                    />):(<Icon name="star" color={'#FAA230'} size={20}/>)}
                  </TouchableHighlight>
              </View>
          )}
          keyExtractor={item => item.id}
        /> 
        <Image
            source={{uri: 'https://firebasestorage.googleapis.com/v0/b/appshopper-92ab0.appspot.com/o/background.png?alt=media&token=7e0f4ee2-c17b-45fa-9067-b1f7bddd811c'}}
            style={homestyles.background}
            resizeMode='cover'
            borderRadius={8}
        />
      </View>
      </ScrollView>
    )
  }
}

const homestyles = StyleSheet.create({
  contaier: {
    height: '100%',
  },
  view : {
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: colors.background
  },
  header : {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'ubuntuMedium',
  },
  perfil : {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionsView : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  switchView : {
    flexDirection: 'row',
  },
  search : {
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'left',
    alignSelf: 'stretch',
    fontFamily: 'ubuntuMedium',
    marginLeft: 6,
    marginBottom: 6
  },
  options : {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: 'ubuntuMedium',
    marginRight: 10,
  },
  optionsFalse: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: 'ubuntuMedium',
    marginRight: 10,
  },
  list: {
    width: '100%',
    paddingBottom: 80
  },
  cell: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    marginTop: 12,
    borderRadius: 6,
    padding: 14,
    paddingBottom: 18,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageCell : {
    width: 70,
    height: 70
  },
  cellText : {
    marginLeft: 2,
    alignItems: 'flex-start',
    marginTop: 4,
    width: '60%',
    height: '100%'
  },
  cellTitle : {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: 'ubuntuMedium'
  },
  cellSubTitle: {
    fontSize: 12,
    color: colors.secondary,
    opacity: 0.6,
    fontFamily: 'ubuntuMedium',
    marginTop: 6,
    lineHeight: 16,
  },
  searchView : {
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 6,
  },
  input : {
    color: colors.secondary,
    marginLeft: 8,
    fontSize: 16,
    color: colors.secondary,
    fontFamily: 'ubuntuMedium',
    paddingLeft: 18
  },
  star : {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    width: 185,
    height: 84,
    position: 'absolute',
    zIndex: -1,
    bottom: 20,
  }
})


class LoginScreen extends React.Component {

  constructor(props){
    super(props)

    this.login = this.login.bind(this)
    this.forgot = this.forgot.bind(this)
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

  forgot(){
    var { emailInput } = this.state

    var refThis = this

    if(emailInput){

      var auth = firebase.auth();

      auth.sendPasswordResetEmail(emailInput).then(function() {
        refThis.refs.toast.show('Email Enviado') 
      }).catch(function(error) {
        // An error happened.
        var errorCode = error.code
        var errorMessage = error.message  
        var error = checkError(errorCode)
        refThis.refs.toast.show(error)
      });

    } else {
      refThis.refs.toast.show('Escreva seu email no campo') 
    }
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
            <TouchableHighlight  onPress={() => this.forgot()}>
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
    height: 100,
    width: 100,
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
          <Stack.Screen name="Perfil" component={PerfilScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }
}
