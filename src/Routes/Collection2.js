import React, { useEffect, useState ,useMemo, useRef} from 'react';
import {TokenCluster} from '../clusters/token-cluster'
import {useCurrentUser} from '../hooks/current-user'
import { Howl } from 'howler';
import Bpm from '../helpers/useBPM';
import PlayButton from '../Components/PlayButton';
import { instruments } from '../helpers/instruments';
import StopButton from '../Components/StopButton';
export default (arr1) => {
  const arr2 = [arr1];
    const [isPlaying, setIsPlaying] = useState(false);
    const [squares, setSquares] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
    // const arr1 = ["#e74b4b","#e74b4b","#e74b4b",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const [playHeadArray, setPlayHeadArray] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
      };
      const [counter, setCounter] = useState(0);
      const [tempo, setTempo] = useState(120);
      let beats = Bpm(tempo);
      const [grid, setGrid] = useState([
        instruments[0].pattern,
        instruments[1].pattern,
        instruments[2].pattern,
        instruments[3].pattern,
        instruments[4].pattern,
        instruments[5].pattern,
        instruments[6].pattern,
        instruments[7].pattern,
        instruments[8].pattern,
        instruments[9].pattern,
        instruments[10].pattern,
        instruments[11].pattern,
        instruments[12].pattern,
        instruments[13].pattern,    
        instruments[14].pattern,
        instruments[15].pattern,
      ]);

      const playSound = (source) => {
        var sound = new Howl({
          src: [source],
          html5: true,
    
        });
        console.log(sound)
        sound.play();
      };
    
      const playSounds = (array) => {

        for (let i = 0; i < 31; i++) {
          playSound(array[i]);
    
        }
    
      };
      const loop = () => {  
        //create an array to hold our sounds for a beat
        let soundArr = [];
        //loop through each instrument in our column
        for (let j = 0; j < 15; j++) {
          //if the square is active e.g. 0,0
          if (grid[j][counter]) {
            //set a temporary variable to hold our soundSrc
            let soundSrc =instruments[j].sound;
                //e.g. "./DrumSamples/ClosedHats/HiHat01.wav"
            soundArr.push(soundSrc);
          }
          playSounds(soundArr);
        }
      };

      useEffect(() => {
        //is the beat machine playing?
        if (isPlaying) {
          //set an interval to perform player logic
          const interval = setInterval(() => {
            //animate the playHead based on counter positionc
 
            // create an array of up to 6 sounds that are then played at the same time
            loop();
            // increments counter based on current tempo
            if (counter < 31) {
              setCounter((prevState) => ++prevState);
            } else {
              setCounter(0);
            }
          }, beats);
          return () => clearInterval(interval);
        }
        resetSquares();
      }, [isPlaying, beats, counter]);




      const resetSquares = () => {
        setCounter(0);
        setPlayHeadArray(
          squares.map((square, i) => (
            <td
              key={i + squares}
              id={i}
              className={square > 0 ? 'playhead' : 'inactive cycle'}
            ></td>
          ))
        );
      };

    
    //   arr1[0].indexOf(findstr)!=-1
    
for(let j=0; j<31;j++)
{
      for (let i = j+15*j ; i < 15+15*j+j ; i++) {
     {
       if( arr2[i][0]=="#")
         {   grid[0][i]=true;

        }
      }
    
    }
}
  
    console.log(grid)

     
  return (
    <div>
      <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
      <StopButton onClick={togglePlay} isPlaying={isPlaying} />
    </div>
  );
}