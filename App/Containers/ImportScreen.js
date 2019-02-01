// @flow

import React from "react";
import { connect } from "react-redux";
import ImportActions from "../redux/actions/import";
import { addTodo } from "../redux/actions";

class ImportScreen extends React.Component {
  componentWillMount() {
    this.props.importStart();
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    importStart: () => dispatch(ImportActions.importStart())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportScreen);
