import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import DimensionsProvider from '../DimensionsProvider';
import SoundfontProvider from '../SoundfontProvider';
import { Col, Row, Image, Container, Overlay, Button } from 'react-bootstrap';
import NavBarComponent from '../navbar';
import Circle from '../circle';
import Video from '../video';
import Select from 'react-select'
import Toast from 'react-bootstrap/Toast'


import './style.css';
import { cpus } from 'os';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('c5'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const CreateDemoPage = (props) => {
  const [activeNote, setActiveNote] = useState(null)
  const [infoBox, setInfoBox] = useState("Testing")
  const [scaleState, setScaleState] = useState(0)
  const [gameDisable, setGameDisable] = useState(true)
  const [modeValue, setModeValue] = useState(0)
  const [startingNoteValue, setStartingNoteValue] = useState(0)
  const [show, setShow] = useState(false);

  //Cycle of fifths notes
  const scaleStartingNotes = [48, 55, 50, 57, 52, 59, 54, 49, 56, 51, 58, 53]

  const correctNote = ["Great!", "Keep going!", "You got this!", "Wow!", "Sounds good!", "Fantastic!"]

  //Circle of Fifths
  const scaleCircle = [
    48, 55, 50, 57, 52, 59, 54, 49, 56, 51, 58, 53
  ]

  const scalePatterns = [
    [0, 2, 4, 5, 7, 9, 11, 12],
    [0, 2, 3, 5, 7, 9, 10, 12],
    [0, 1, 3, 5, 7, 8, 10, 12],
    [0, 2, 4, 6, 7, 9, 11, 12],
    [0, 2, 4, 5, 7, 9, 10, 12],
    [0, 2, 3, 5, 7, 8, 10, 12],
    [0, 1, 3, 5, 6, 8, 10, 12],
  ]

  const dropdownNotes = [
    { value: '0', label: 'C' },
    { value: '1', label: 'G' },
    { value: '2', label: 'D' },
    { value: '3', label: 'A' },
    { value: '4', label: 'E' },
    { value: '5', label: 'B' },
    { value: '6', label: 'F#(G' + String.fromCharCode(9837) + ')' },
    { value: '7', label: 'C#(D' + String.fromCharCode(9837) + ')' },
    { value: '8', label: 'A' + String.fromCharCode(9837) },
    { value: '9', label: 'E' + String.fromCharCode(9837) },
    { value: '10', label: 'B' + String.fromCharCode(9837) },
    { value: '11', label: 'F' }
  ]

  const noteLabel = [
    "C",
    "G",
    "D",
    "A",
    "E",
    "B",
    'F#(G' + String.fromCharCode(9837) + ')',
    'C#(D' + String.fromCharCode(9837) + ')',
    'A' + String.fromCharCode(9837),
    'E' + String.fromCharCode(9837),
    'B' + String.fromCharCode(9837),
    'F'
  ]

  const dropdownModes = [
    { value: '0', label: 'Ionian (major)' },
    { value: '1', label: 'Dorian (minor)' },
    { value: '2', label: 'Phrygian' },
    { value: '3', label: 'Lydian' },
    { value: '4', label: 'Mixolydian (dominant)' },
    { value: '5', label: 'Aeolian' },
    { value: '6', label: 'Locrian' },
    { value: '7', label: 'testing123' }
  ]

  //MUSIC JINGLE DATA START
  const jingleSongData = [
    {
      songTitle: "Let it Be",
      songArtist: "The Beatles",
      songRootNote: 53,
      songNotes: [0, -2, -4, 0, 3, 5, 3, 3, -4, -7, -9, 0, 0, 0, 1, 0, 0, -2, 0, -2, -4, null],
      songNoteDurations: [0, 250, 250, 1250, 250, 250, 1250, 250, 250, 1250, 250, 250, 1500, 500, 500, 500, 250, 500, 750, 250, 250, 1500]
    },
    {
      songTitle: "Scarborough Fair",
      songArtist: "Simon & Garfunkel",
      songRootNote: 52,
      songNotes: [0, 0, 7, 7, 7, 2, 3, 2, 0, null, 7, 10, 12, 12, 10, 12, 10, 7, null],
      songNoteDurations: [0, 500, 500, 500, 500, 500, 500, 500, 500, 1500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
    },
    {
      songTitle: "White Rabbit",
      songArtist: "Jefferson Airplane",
      songRootNote: 61,
      songNotes: [0, 0, 1, 0, 1, 0, 0, -2, -2, -4, -6, -2, 3, 3, 0, 0, 1, 0, 1, 0, 0, 0, -2, -2, -2, -4, -6, -2, null],
      songNoteDurations: [0, 600, 1200, 300, 300, 300, 1500, 600, 600, 1200, 300, 300, 1800, 300, 300, 600, 1200, 300, 300, 600, 1200, 600, 600, 600, 300, 300, 300, 300, 1800]
    },
    {
      songTitle: "The Simpsons",
      songArtist: "Danny Elfman",
      songRootNote: 60,
      songNotes: [0, 4, 6, 9, 7, 4, 0, -3, -6, -6, -6, -5, null, -6, -6, -6, -5, -2, 0, 0, 0, 0, null],
      songNoteDurations: [0, 620, 351, 351, 176, 527, 351, 351, 176, 176, 176, 176, 527, 527, 176, 176, 176, 176, 527, 176, 176, 176, 176]
    },
    {
      songTitle: "The Wreck of the Edmund Fitzgerald",
      songArtist: "Gordon Lightfoot",
      songRootNote: 47,
      songNotes: [7, 12, 12, 12, 12, 14, 12, 10, 7, 7, 7, 7, 7, 9, 10, 10, 10, 9, 7, 5, 7, 0, null],
      songNoteDurations: [0, 423, 423, 423, 423, 1268, 1268, 423, 423, 0, 845, 845, 1690, 0, 423, 845, 845, 845, 845, 845, 423, 1268, 1690]
    },
    {
      songTitle: "Crazy Train",
      songArtist: "Ozzy Osbourne",
      songRootNote: 54,
      songNotes: [0, 0, 7, 0, 8, 0, 7, 0, 5, 3, 2, 3, 5, 3, 2, 3, 0, 0, 7, 0, 8, 0, 7, 0, 5, 3, 2, 3, 5, 3, 2, -2, 0, null],
      songNoteDurations: [0, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 218, 1200]
    },
    {
      songTitle: "Army of Me",
      songArtist: "Bjork",
      songRootNote: 46,
      songNotes: [0, 1, 0, 8, 6, 0, 1, 0, 1, 0, 8, 6, 0, 1, 3, 0, 4, null, 4, 6, 4, 4, 3, 3, null, 3, 0, 4, 4, 4, null, 6, 4, 3, null],
      songNoteDurations: [0, 211, 211, 211, 211, 211, 211, 422, 211, 211, 211, 211, 211, 211, 422, 635, 635, 635, 1300, 635, 635, 635, 635, 635, 635, 1300, 635, 635, 141, 141, 141, 1300, 635, 635, 1690]
    },
    {
      songTitle: "test1",
      songArtist: "me!",
      songRootNote: 64,
      songNotes: [0, -2, -4, 0, 3, 5, 3, 3, -4, -7, -9, 0, 0, 0, 1, 0, 0, -2, 0, -2, -4, null],
      songNoteDurations: [0, 250, 250, 1250, 250, 250, 1250, 250, 250, 1250, 250, 250, 1500, 500, 500, 500, 250, 250, 500, 250, 250, 1500]
    }
  ]
  //MUSIC JINGLE DATA END






  console.log("It rerendered")


  const assignStartingNote = (e) => {
    setStartingNoteValue(e.value)
    console.log("Note:  ", e.value)
  }

  const assignMode = (e) => {
    setModeValue(e.value)
    console.log("mode: ", e.value)
  }


  //Plays the scales
  const playScale = (e) => {
    if (!gameDisable) {
      setGameDisable(true)
    }
    setInfoBox("Listen")
    setTimeout(function () {
      setGameDisable(false)
      setInfoBox("Now you try!")
    }, 8035)
    setTimeout(function () {
      setActiveNote(null)
    }, 8000)
    scalePatterns[modeValue].map(
      function (currentValue, index) {
        setTimeout(
          function () {
            var activeNoteArray = []
            activeNoteArray.push(scaleCircle[startingNoteValue] + currentValue)
            setActiveNote(activeNoteArray)
          }, (1000 * index)
        )
      }
    )
  }

  const playJingle = (e) => {
    var jingleTime = 0
    setInfoBox("Listen to this!")
    console.log("Here is length of notes:  ", jingleSongData[modeValue].songNotes.length)
    console.log("Here is length of notes:  ", jingleSongData[modeValue].songNoteDurations.length)
    jingleSongData[modeValue].songNotes.map(
      function (currentValue, index) {
        console.log("current index value", index)
        console.log("jingley", jingleSongData[modeValue].songNoteDurations[index])
        jingleTime += jingleSongData[modeValue].songNoteDurations[index]
        console.log("jingletime!", jingleTime)
        if (currentValue === null) {
          setTimeout(
            function () {
              var activeNoteArray = []
              console.log("Setting NULL!")
              activeNoteArray.push(0)
              setActiveNote(activeNoteArray)
            }, (jingleTime)
          )
        }
        else {
          setTimeout(
            function () {
              var activeNoteArray = []
              console.log(jingleSongData[modeValue].songRootNote + currentValue)
              activeNoteArray.push(jingleSongData[modeValue].songRootNote + parseInt(startingNoteValue) + currentValue)
              setActiveNote(activeNoteArray)
            }, (jingleTime + 20)
          )
          setTimeout(
            function () {
              var activeNoteArray = []
              activeNoteArray.push(null)
              setActiveNote(activeNoteArray)
            }, (jingleTime)
          )
        }
      }
    )
  }





  //Takes Keyboard input while game is active
  var recordedArray = []
  const recordNote = (midiNumber) => {
    if (!gameDisable) {
      if (midiNumber == scaleStartingNotes[startingNoteValue] + scalePatterns[modeValue][scaleState]) {
        setScaleState(scaleState + 1)
        var displayPat = correctNote[Math.floor(Math.random() * correctNote.length)]
        setInfoBox(displayPat)
        if (scaleState == 7) {
          setGameDisable(true)
          setInfoBox("Wow great job!")
          setTimeout(function () { setInfoBox("--") }, 2000)
          setScaleState(0)
        }
      }
      else {
        console.log("midinumber: ", midiNumber)
        console.log("scaleStartingNotes:  ", scaleStartingNotes)
        setInfoBox("Oops!")
        setGameDisable(true)
        setTimeout(function () {
          setScaleState(0)
          setTimeout(function () {
            playScale()
          }, 1000)
        }, 1500)
      }
    }
    recordedArray.push(midiNumber)
    console.log(recordedArray)
  }

  //Starts game from button click
  const startGameButton = () => {
    playScale()
  }

  const playJingleButton = () => {
    playJingle()
    setShow(true)
  }

  return (<>
    <NavBarComponent />
    <div className="container-fluid">
      <Row>
        <Col md={5} className="charts">
          <Circle />
        </Col>
        <Col md={7}>
          <Video />
        </Col>
      </Row>
      {/* <Row className="form-row text-center">
        <Col>
          <Button className="buttons" variant="light" onClick={startGameButton}>Demo Scale</Button>
          <Button className="buttons" variant="light" onClick={playJingleButton}>Play Jingle</Button>
        </Col>
      </Row> */}
      <Row>
        <Col>
          <p id="infoBox" className="text-center infobox">{infoBox}</p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center drop1container">
          <Select defaultValue={{ label: "C", value: 0 }} aria-label="Starting Note" className="dropdown1" onChange={assignStartingNote} options={dropdownNotes} />
        </Col>
        <Col className="text-center drop2container">
          <Select defaultValue={{ label: "Ionian (major)", value: 0 }} aria-label="Mode" className="dropdown2" onChange={assignMode} options={dropdownModes} />
        </Col>
        <Col className="text-center">
          <Button className="buttons" variant="light" onClick={startGameButton}>Demo Scale</Button>
          <Button className="buttons" variant="light" onClick={playJingleButton}>Play Jingle</Button>
        </Col>
      </Row>
      <Row>
      <Col xs={6}>
        <Toast className="toastbox" onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto titlebox">{jingleSongData[modeValue].songTitle}</strong>
            <small>In the key of {noteLabel[startingNoteValue]}</small>
          </Toast.Header>
          <Toast.Body className="bodybox">{jingleSongData[modeValue].songArtist}</Toast.Body>
        </Toast>
      </Col>
      <Col xs={6}>
      </Col>
    </Row>
      <div className="wrapper">
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <SoundfontProvider
              instrumentName="acoustic_grand_piano"
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <Piano
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  activeNotes={activeNote}
                  keyboardShortcuts={keyboardShortcuts}
                  onPlayNoteInput={recordNote}
                  {...props}
                />

              )}
            />
          )}
        </DimensionsProvider>
      </div>
    </div>
  </>
  );
}

export default CreateDemoPage
