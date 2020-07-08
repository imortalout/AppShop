import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as Font from 'expo-font'
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight, Button, KeyboardAvoidingView, ScrollView, FlatList } from 'react-native'
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

// Login Teste
// teste@teste.com[Email]
// 123456789[Senha]

var colors = {
  primary: '#1EA7DB',
  secondary: '#3E4148',
  secondaryOp: 'rgba(62, 65, 72, 0.6)',
  white: '#FFF',
  background: '#E7ECFA'
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
    userInfo: null,
    products: [],
    fullProducst: [],
    searchInput: '',
    refresh: false
  }

  constructor(props){
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.getList = this.getList.bind(this)
  }


  async componentWillMount() {

      await Font.loadAsync({
          'ubuntuMedium': require('./assets/fonts/Ubuntu-Medium.ttf'),
          'ubuntuRegular': require('./assets/fonts/Ubuntu-Regular.ttf'),
      })

      this.setState({
          fontLoaded: true,
      })

      // Adicionando Produtos
      // var refBase =  firebase.database().ref('products').push()
      // refBase.set({
      //   name: 'Laranja',
      //   photo: 'https://firebasestorage.googleapis.com/v0/b/appshopper-92ab0.appspot.com/o/Laranja.png?alt=media&token=bfad6156-c39e-4917-8683-edf197a54c25',
      //   desc: 'Melhor  do que essa tu nao encontra em lugar nenhum'
      // })
  }


  componentDidMount(){

    var refThis = this

    firebase.auth().onAuthStateChanged(function(user) {
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
      } else {
        refThis.props.navigation.navigate('Login')
      }
    })



    this.getList()
  }

  getList(){

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
              console.log('Key : ' + key)
              // console.log(array)
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

      refThis.setState({
        products: array,
        fullProducst: array,
        refresh: false,
      })
    })
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
     firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
  }

  onRefresh(){

    this.setState({
      refresh: true,
      products: [],
    })

    this.getList()
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


  render(){

    var { nameUser, fontLoaded, products, searchInput, refresh } =  this.state

    return (
    <ScrollView contentContainerStyle={homestyles.container} keyboardShouldPersistTaps='handled' scrollEnabled={false}>
      <View style={homestyles.view}>
        <StatusBar style="dark" />
        <View style={homestyles.header}>
          {fontLoaded ? (<Text style={homestyles.title}>Olá, {nameUser}</Text>): null}
          <Icon name="user" color={colors.white} size={20}/> 
        </View>
        {fontLoaded ? (<Text style={homestyles.search}>Produtos</Text>): null}
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
    height: '105%',
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
  search : {
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'left',
    alignSelf: 'stretch',
    fontFamily: 'ubuntuMedium',
    marginLeft: 6,
    marginBottom: 6
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
    width: '60%'
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
  background: {
    width: 185,
    height: 84,
    position: 'absolute',
    zIndex: -1,
    bottom: 10,
  },
  star : {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
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
