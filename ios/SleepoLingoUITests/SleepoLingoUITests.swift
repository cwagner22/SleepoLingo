//
//  SleepoLingoUITests.swift
//  SleepoLingoUITests
//
//  Created by Christophe on 3/10/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class SleepoLingoUITests: XCTestCase {

    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        let app = XCUIApplication()
        app.otherElements["LessonItem_0-0"].waitForExistence(timeout: 30)
        snapshot("0Launch")
        app.otherElements["LessonItem_0-0"].tap()
        snapshot("1Lesson")

        // Start Night Player
        app.otherElements["StartNight"].tap()
        sleep(5)
        snapshot("2Night")
        app.otherElements["StopPlayer"].swipeUp()

        // Start Anki Cards
        app.otherElements["StartStudy"].waitForExistence(timeout: 30)
        app.otherElements["StartStudy"].tap()
        snapshot("3AnkiOriginal")
        // Show Answer
        app.otherElements["AnkiSwipe"].tap()
        app.otherElements["AnkiButtonHard"].waitForExistence(timeout: 30)
        snapshot("4AnkiTranslation")

        // Next Card
//        app.otherElements["AnkiButtonHard"].tap()
//        snapshot("5AnkiOriginal")
//        app.otherElements["AnkiSwipe"].tap()
//        app.otherElements["AnkiButtonHard"].waitForExistence(timeout: 30)
//        snapshot("6AnkiTranslation")
    }

}
