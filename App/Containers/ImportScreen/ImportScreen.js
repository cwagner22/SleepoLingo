// @flow

import React from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
// import ImportActions from "../../redux/actions";
import ImportActions from "../../Redux/ImportRedux";

// import { startImport } from "../../redux/actions";
import RoundedButton from "../../Components/RoundedButton";
import styles from "./ImportScreenStyle";

class ImportScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleStartImport = this.handleStartImport.bind(this);
  }

  handleStartImport() {
    console.log(ImportActions);
    console.log(this.props.startImport);
    this.props.startImport();
  }

  render() {
    return (
      <View style={styles.full}>
        <Text>Importing...</Text>
        <RoundedButton onPress={this.handleStartImport}>
          Start Import
        </RoundedButton>
        <Text>Importing...</Text>
      </View>
    );
  }
}

// const mapStateToProps = state => {
//   return {};
// };

const mapDispatchToProps = dispatch => {
  return {
    startImport: () => dispatch(ImportActions.startImport())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ImportScreen);
