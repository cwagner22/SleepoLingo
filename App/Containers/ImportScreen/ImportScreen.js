// @flow

import React from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";
// import ImportActions from "../../redux/actions";
import ImportActions from "../../Redux/ImportRedux";
import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";

// import { startImport } from "../../redux/actions";
import RoundedButton from "../../Components/RoundedButton";
import styles from "./ImportScreenStyle";

class ImportScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleStartImport = this.handleStartImport.bind(this);
  }

  handleStartImport() {
    this.props.startImport(this.props.database);
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
    startImport: database => dispatch(ImportActions.startImport(database))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withDatabase(ImportScreen));

// const enhance = withDatabase(
//   withObservables([], ({ database }) => ({
//     blogs: database.collections
//       .get("blogs")
//       .query()
//       .observe()
//   }))(BlogList)
// );

// const enhance = withDatabase(withObservables([], ({ database }) => ({
//   blogs: database.collections.get('blogs').query().observe(),
// }))(BlogList))

// const enhance = withObservables(['post'], ({ post }) => ({
//   post: post.observe(),
//   comments: post.comments.observe()
// }))

// export default withDatabase(ImportScreen);
