import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useRef, useEffect } from 'react';

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";
function App() {
  //set the state and property
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState("")
  const [stream, setStream] = useState(null)
  const [currentStream, setCurrentStream] = useState(null)
  const [currentCameraInUse, setCurrentCameraInUse] = useState(FACING_MODE_ENVIRONMENT)



  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
  }

  let videoRef = useRef(null)
  let photoRef = useRef(null)
  const constraints = {
    video: {
      width: {
        min: 560,
        ideal: 768,
        max: 720,
      },
      height: {
        min: 360,
        ideal: 500,
        max: 720
      },
      facingMode: currentCameraInUse
    },
    audio: false
  }

  // get access to user webCamera 
  async function getUserCamera() {

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // console.log(stream)
        setCurrentStream(stream)
        // console.log(stream)
        setStream(stream)
        let video = videoRef.current

        video.srcObject = stream
        video.play()
        console.log(videoRef.current.videoHeight)
      })

      .catch((error) => {
        console.error(error)
      })


  }

  // stop camera
  async function stopStreamVideo() {
    currentStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  // Browse cameras 
  async function switchCamera() {
    setCurrentCameraInUse(prev => prev === FACING_MODE_ENVIRONMENT ? FACING_MODE_USER : FACING_MODE_ENVIRONMENT)
    getUserCamera()
  }

  // Onclick take picture
  const takePicture = (e) => {
    let width = 768
    let height = 500

    let canvas = photoRef.current
    let video = videoRef.current
    // set the photo width and height
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const data = canvas.toDataURL('image/png');
    let imgBlob = new Blob([data], { type: 'text/plain' });
    setCurrentImage([...currentImage, imgBlob])
  }


  // clear Photo
  const clearImage = () => {
    let photo = photoRef.current
    let ctx = photo.getContext('2d')
    ctx.clearRect(0, 0, photo.width, photo.height)
  }

  //close modal
  const handleClose = () => {
    setShow(false)
    stopStreamVideo()

  };
  // open modal
  const handleShow = () => { setShow(true); getUserCamera() }



  return (
    <>
      <Button variant="primary" onClick={handleShow}>Open Camera</Button>
      <Button variant="primary" onClick={clearImage}>Clear Image</Button>
      <div>
        <canvas id='vid' ref={photoRef}></canvas>
      </div>
      <div>
        <img className='photo' />
      </div>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>

          <Modal.Title> <Button onClick={switchCamera}>SwitchCamera</Button> </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className='container'>
            <video className="videoConvas" ref={videoRef}></video>

          </div>
        </Modal.Body>



        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={takePicture}>
            Capture
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default App;
