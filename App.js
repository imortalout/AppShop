import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as Font from 'expo-font'
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

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


class LoginScreen extends React.Component {

  state = {
    fontLoaded: false
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

  render(){

    var { fontLoaded, emailInput, passwordInput } = this.state

    return(

    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Image
          style={styles.logo}
          source={require('./assets/logo.png')}
          />  
        </View>
        <View style={styles.login}>
          {fontLoaded ? (
            <TextInput
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({emailInput: text})
            }}
            style={styles.input}
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
          <View style={styles.separator}></View>
          {fontLoaded ? (
            <TextInput
            ref={(input) => { this.senha = input}}
            keyboardType="default"
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({passwordInput: text})
            }}
            style={styles.input}
            textAlignVertical='top'
            value={passwordInput}
            editable={true}
            paddingLeft={8}
            placeholder="SENHA"
            placeholderTextColor={colors.secondaryOp}
            keyboardAppearance="dark"
            onSubmitEditing={() => { this.senha.focus(); }}
            blurOnSubmit={false}
            secureTextEntry={true}
          />
            ) : null}
          <View style={styles.separator}></View>
          <View style={styles.viewButton}>
            {fontLoaded ? (<Text style={styles.loginText}>Login</Text>) : null }
            <TouchableHighlight style={styles.buttonLogin} onPress={() => this.props.navigation.navigate('SignUp')}>
              <Icon name="arrow-right" color={colors.white} size={24}/> 
            </TouchableHighlight>
          </View>
        </View>
      </View>
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
        <Stack.Navigator screenOptions={{
    headerShown: false
      }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  header : {
    height: 220,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingTop: 40,
  },
  logo : {
    height: 120
  },
  login: {
    paddingTop: 80,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
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
    marginTop: 50,
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
  }
});
