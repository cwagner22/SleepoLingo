// @flow

import React from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import LessonActions from '../Redux/LessonRedux'
// import FullButton from '../Components/FullButton'
import CardBack from '../Containers/CardBack'
import CardFront from '../Containers/CardFront'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  renderCard () {
    if (this.props.lesson.isFront) {
      return <CardFront />
    } else {
      return <CardBack />
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {this.renderCard()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: state.lesson
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showFront: () => dispatch(LessonActions.ankiShowFront())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
