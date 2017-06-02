// @flow

import React from 'react'
import { View, Alert } from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper-animated'

import LessonActions from '../Redux/LessonRedux'
import AnkiFooter from './AnkiFooter'
import AnkiCard from '../Components/AnkiCard'
import { Lesson } from '../Realm/realm'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  componentWillMount () {
    this.props.navigation.setParams({
      title: this.props.lessonName
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentCardId !== this.props.currentCardId) {
      // Next card
      if (this.props.currentCardId) {
        // todo: create jumpToIndexAnimated
        this.swiper.jumpToIndex(this.props.cardIds.indexOf(nextProps.currentCardId))
      }

      if (!nextProps.currentCardId) {
        this.props.lessonUpdateCompleted(true)
        Alert.alert(
          'Well done',
          'No more cards, come back later!',
          [{
            text: 'OK',
            onPress: () => this.props.navigation.reset({
              index: 0,
              actions: [
                this.props.navigation.navigate({routeName: 'LessonsListScreen'})
              ]
            })
          }]
        )
      }
    }
  }

  swiper = null

  render () {
    return (
      <View style={{flex: 1}}>
        <Swiper
          ref={(swiper) => {
            this.swiper = swiper
          }}
          style={styles.wrapper}
          showPagination={false}
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
    lessonName: lesson.name,
    currentCardId: state.lesson.currentCardId,
    cardIds: lesson.cards.map(c => c.id)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard()),
    loadNextCards: () => dispatch(LessonActions.loadNextCards()),
    startLesson: () => dispatch(LessonActions.lessonStart()),
    lessonUpdateCompleted: (isCompleted) => dispatch(LessonActions.lessonUpdateCompleted(isCompleted))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
