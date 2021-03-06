import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
// import database from "../App/Models/database";
// import mock from "mock-fs";
// import fs from "fs";
//
// const path = require("path");
import mockFs from "fs";

configure({ adapter: new Adapter() });

// Mock your external modules here if needed
// jest
// .mock('react-native-device-info', () => {
//   return { isTablet: jest.fn(() => { return false }) }
// })
// mock({
//   "lessons.xlsx": "a"
// });

// database.__Rewire__("watermelonAdapter", LokiJSAdapter);
// database.__ResetDependency__("watermelonAdapter");

jest.mock("../App/Models/database");

jest.mock("../App/Services/NavigationService", () => ({
  navigate: jest.fn()
}));
jest.mock("react-native-background-timer", () => {});
jest.mock("react-native-sound");
jest.mock("rn-fetch-blob", () => {});
jest.mock("react-native-simple-toast", () => ({
  show: jest.fn()
}));

jest.mock("react-native-fs", () => {
  return {
    mkdir: jest.fn(),
    // moveFile: jest.fn(),
    // copyFile: jest.fn(),
    // pathForBundle: jest.fn(),
    // pathForGroup: jest.fn(),
    // getFSInfo: jest.fn(),
    // getAllExternalFilesDirs: jest.fn(),
    // unlink: jest.fn(),
    // exists: jest.fn(),
    // stopDownload: jest.fn(),
    // resumeDownload: jest.fn(),
    // isResumable: jest.fn(),
    // stopUpload: jest.fn(),
    // completeHandlerIOS: jest.fn(),
    readDir: jest.fn(() => [
      {
        name: "cf8c96b6656c531eafaa3b003b7ced34.mp3",
        path: "test/en-US/cf8c96b6656c531eafaa3b003b7ced34.mp3",
        size: 4608
      }
    ]),
    // readDirAssets: jest.fn(),
    // existsAssets: jest.fn(),
    // readdir: jest.fn(),
    // setReadable: jest.fn(),
    // stat: jest.fn(),
    readFile: jest.fn(filePath => {
      return mockFs.readFileSync(filePath);
    }),
    // read: jest.fn(),
    // readFileAssets: jest.fn(),
    hash: jest.fn(() => {
      return Math.random()
        .toString(36)
        .substr(2, 5);
    })
    // copyFileAssets: jest.fn(),
    // copyFileAssetsIOS: jest.fn(),
    // copyAssetsVideoIOS: jest.fn(),
    // writeFile: jest.fn(),
    // appendFile: jest.fn(),
    // write: jest.fn(),
    // downloadFile: jest.fn(),
    // uploadFiles: jest.fn(),
    // touch: jest.fn(),
    // MainBundlePath: jest.fn(),
    // CachesDirectoryPath: jest.fn(),
    // DocumentDirectoryPath: jest.fn(),
    // ExternalDirectoryPath: jest.fn(),
    // ExternalStorageDirectoryPath: jest.fn(),
    // TemporaryDirectoryPath: jest.fn(),
    // LibraryDirectoryPath: jest.fn(),
    // PicturesDirectoryPath: jest.fn()
  };
});
