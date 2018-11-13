import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

import styles from './Styles/DrawerButtonStyles'
// import ExamplesRegistry from '../Services/ExamplesRegistry'

// Note that this file (App/Components/DrawerButton) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
// ExamplesRegistry.addComponentExample('Drawer Button', () =>
//   <DrawerButton
//     text='Example left drawer button'
//     onPress={() => window.alert('Your drawers are showing')}
//   />
// )

class DrawerButton extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  render () {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
        <Icon name='menu' style={styles.iconStyle}
        />
      </TouchableOpacity>
    )
  }
}

export default DrawerButton
