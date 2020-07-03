import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

var colors = {
  primary: '#1EA7DB',
  secondary: '#3E4148',
  secondaryOp: 'rgba(62, 65, 72, 0.6)',
  white: '#FFF'
}

export default class App extends React.Component {

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

    return (
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
            <TouchableHighlight style={styles.buttonLogin}>
              <Icon name="arrow-right" color={colors.white} size={24}/> 
            </TouchableHighlight>
          </View>
        </View>
      </View>
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
    height: 200,
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
    paddingTop: 60,
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
