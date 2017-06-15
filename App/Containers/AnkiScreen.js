// @flow

import React from 'react'
import { View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper-animated'
import { Card } from 'react-native-elements'

import LessonActions from '../Redux/LessonRedux'
import AnkiFooter from './AnkiFooter'
import AnkiCard from '../Components/AnkiCard'
import { Lesson } from '../Realm/realm'
import RoundedButton from '../Components/RoundedButton'
import NavigationActions from '../Navigation/NavigationActions'
import LessonTitle from './LessonTitle'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    return {
      headerTitle: <LessonTitle />,
      headerRight: (
        <Button onPress={() => params.navigateToWords()} title='All Words' />
      )
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentCardId !== this.props.currentCardId) {
      // Next card
      if (this.props.currentCardId) {
        if (nextProps.currentCardId) {
          this.swiper.jumpToIndex(this.props.cardIds.indexOf(nextProps.currentCardId), true)
        }
      }
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({ navigateToWords: this.props.navigateToWords })
  }

  currentCardIndex () {
    return this.props.cardIds.indexOf(this.props.currentCardId)
  }

  renderNoCards () {
    return (
      <Card wrapperStyle={{flex: 1}} containerStyle={{flex: 1}}
        title='LESSON DONE'>
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCards}>Well done there are no more cards, come back later!</Text>
        </View>
        <RoundedButton styles={styles.finishButton} onPress={this.props.navigateToLessons}>
          Finish
        </RoundedButton>
      </Card>
    )
  }

  swiper = null

  render () {
    if (!this.props.currentCardId) {
      return this.renderNoCards()
    }
    return (
      <View style={{flex: 1}}>
        <Swiper
          ref={(swiper) => {
            this.swiper = swiper
          }}
          style={styles.wrapper}
          showPagination={false}
          swiper={false}
          index={this.currentCardIndex()}
          backPressToBack={false}
        >
          {this.props.cardIds.map(cardId => (
            <AnkiCard cardId={cardId} key={cardId} />
          ))}
        </Swiper>
        <AnkiFooter />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const lesson = Lesson.getFromId(state.lesson.currentLessonId)
  return {
    lesson: state.lesson,
    currentCardId: state.lesson.currentCardId,
    cardIds: lesson.cards.map(c => c.id)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard()),
    startLesson: () => dispatch(LessonActions.lessonStart()),
    lessonUpdateCompleted: (isCompleted) => dispatch(LessonActions.lessonUpdateCompleted(isCompleted)),
    navigateToLessons: () => dispatch(NavigationActions.reset('LessonsListScreen')),
    navigateToWords: () => dispatch(NavigationActions.navigate('WordsListScreen'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
