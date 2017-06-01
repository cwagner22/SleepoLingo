// @flow

import React from 'react'
import { View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Card as CardElem } from 'react-native-elements'
import FlipCard from 'react-native-flip-card'

import LessonActions from '../Redux/LessonRedux'
import CardOriginal from '../Components/CardOriginal'
import CardTranslation from './CardTranslation'
import AnkiFooter from './AnkiFooter'
import { Card } from '../Realm/realm'

// Styles
import styles from './Styles/AnkiScreenStyle'

class AnkiScreen extends React.Component {
  state = {
    flip: false
  }

  componentWillMount () {
    this.props.startLesson()
    this.props.loadNextCard()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentCard !== this.props.currentCard && !nextProps.currentCard) {
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

  renderFooter () {
    if (this.props.lesson.showAnswer) {
      return (
        <AnkiFooter />
      )
    }
  }

  flip () {
    this.setState({flip: !this.state.flip})
  }

  render () {
    if (!this.props.currentCard) {
      return null
    }

    return (
      <View style={styles.mainContainer}>
        <FlipCard style={styles.card}
          flip={this.state.flip}
          friction={6}
          perspective={1000}
          clickable={false}
          flipHorizontal
          flipVertical={false}>
          <CardElem containerStyle={{flex: 1, padding: 5}} wrapperStyle={{flex: 1}}>
            <CardOriginal text={this.props.currentCard.sentence.original}
              fullText={this.props.currentCard.fullSentence && this.props.currentCard.fullSentence.original}
              onPress={() => this.flip()} />
          </CardElem>
          <CardElem containerStyle={{flex: 1, padding: 5}} wrapperStyle={{flex: 1}}>
            <CardTranslation cardId={this.props.currentCard.id} sentence={this.props.currentCard.sentence}
              fullSentence={this.props.currentCard.fullSentence} note={this.props.currentCard.note}
              onPress={() => this.flip()} />
          </CardElem>
        </FlipCard>
        {this.renderFooter()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lesson: state.lesson,
    currentCard: state.lesson.currentCardId ? Card.getFromId(state.lesson.currentCardId) : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAnswer: () => dispatch(LessonActions.lessonShowAnswer()),
    loadNextCard: () => dispatch(LessonActions.loadNextCard()),
    startLesson: () => dispatch(LessonActions.lessonStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnkiScreen)
