// @flow

import React from 'react'
import { View, ScrollView, Text, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Modal from 'react-native-modalbox'

import { Lesson } from '../Realm/realm'
import LessonActions from '../Redux/LessonRedux'
import RoundedButton from '../Components/RoundedButton'
import NavigationActions from '../Navigation/NavigationActions'
import PlayerScreen from './PlayerScreen'

// Styles
import styles from './Styles/LessonScreenStyles'
import { Colors } from '../Themes/'

// const MyTitle = ({ navigation, text }) => <Text text={text} navigation={navigation} />;
// const MyConnectedTitle = connect(storeState => ({ text: storeState.title }))(MyTitle);

class LessonScreen extends React.Component {
  state = {
    modalVisible: false
  }

  componentWillMount () {
    const {lesson} = this.props
    this.props.navigation.setOptions({
      title: lesson.name,
      gesturesEnabled: Platform.OS === 'ios',
      headerBackTitle: 'Back'
    })

    this.props.downloadLesson(lesson.cards)
  }

  renderNightButton () {
    if (!this.state.modalVisible) {
      return (
        <ActionButton buttonColor={Colors.easternBlue} onPress={() => this.startNight()} offsetY={85}
          icon={<Icon name='hotel' color='white' />} />
      )
    }
  }

  render () {
    const {lesson} = this.props

    return (
      <View style={styles.mainContainer}>
        <Card title='Lesson Notes' containerStyle={{flex: 1}} wrapperStyle={{flex: 1}}>
          <ScrollView>
            <Text style={styles.componentLabel}>{lesson.note}</Text>
          </ScrollView>
          <View>
            <RoundedButton onPress={() => this.startDay()} styles={styles.button}>
              START STUDY
            </RoundedButton>
          </View>
        </Card>
        <Modal
          style={styles.mainContainer}
          // style={[styles.modal, styles.modal1]}
          ref={'nightPlayerModal'}
          // ref={(elem) => (elem.open())}
          swipeToClose
          entry='top'
          onClosed={() => this.onPlayerClose()}
          // onOpened={this.onOpen}
          // onClosingState={this.onClosingState}
          backdropOpacity={0.95}
          // swipeArea={Dimensions.get('window').height*0.65}
        >
          <PlayerScreen />
        </Modal>
        { this.renderNightButton() }
      </View>
    )
  }

  startDay () {
    this.props.startAnki()
    // this.props.navigation.navigate('AnkiScreen', {title: this.props.lesson.name})
  }

  onPlayerClose () {
    this.props.navigation.setOptions({
      header: undefined, // Default header
      gesturesEnabled: Platform.OS === 'ios'
    })
    this.setState({modalVisible: false})
    StatusBar.setBarStyle('dark-content')
  }

  startNight () {
    this.props.navigation.setOptions({
      header: null,
      gesturesEnabled: false
    })
    this.setState({modalVisible: true})
    this.refs.nightPlayerModal.open()
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: Lesson.getFromId(state.lesson.currentLessonId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    downloadLesson: (words) => dispatch(LessonActions.downloadLesson(words)),
    startAnki: () => dispatch(LessonActions.lessonStartAnki()),
    navigateToPlayerScreen: (lessonId) => dispatch(NavigationActions.navigate('PlayerScreen'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen)
