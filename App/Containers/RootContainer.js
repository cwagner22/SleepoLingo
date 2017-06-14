import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import Navigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log('copy');
  //   Realm.copyBundledRealmFiles();
  // }

  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='default' />
        <Navigation
          // ref={navigatorRef => {
          // NavigatorService.setContainer(navigatorRef)
          // }}
          // screenProps={this.props.settings}
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav
          })}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
})

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
