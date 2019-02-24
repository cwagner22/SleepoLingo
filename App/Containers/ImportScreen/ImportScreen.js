// @flow

import React from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
import ImportActions from "../../Redux/ImportRedux";

import RoundedButton from "../../Components/RoundedButton";
import styles from "./ImportScreenStyle";

class ImportScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleStartImport = this.handleStartImport.bind(this);
  }

  handleStartImport() {
    this.props.forceImportLessons();
  }

  render() {
    return (
      <View style={styles.full}>
        <RoundedButton onPress={this.handleStartImport}>
          Start Import
        </RoundedButton>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    forceImportLessons: () => dispatch(ImportActions.forceImportLessons())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ImportScreen);
