// @flow

const copilot = (screenName, props) => {
  let copilotAlreadyFinished = props.copilotScreens.some(
    screen => screen === screenName
  );
  if (!copilotAlreadyFinished) {
    props.copilotEvents.on("stop", () => {
      props.addCopilotScreen(screenName);
    });
  }

  return {
    isAlreadyFinished() {
      return copilotAlreadyFinished;
    },
    start() {
      if (!copilotAlreadyFinished) {
        // https//github.com/okgrow/react-native-copilot/issues/75
        this.timer = setTimeout(() => {
          props.start();
          copilotAlreadyFinished = true;
        }, 500);
      }
    },
    unload() {
      clearTimeout(this.timer);
      props.copilotEvents.off("stop");
    }
  };
};

export default copilot;
