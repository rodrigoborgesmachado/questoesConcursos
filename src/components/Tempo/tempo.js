import './tempo.css';
import configData from "./../../config.json";
import { useState, useEffect } from 'react';

function Tempo(props){
    const[tempo, setTempo] = useState(props.inicio);
    const[start, setStart] = useState(true);

    useEffect(() =>
    {
        let intervalId;

        if(start){
            intervalId = setInterval(() => {
                setTempo(tempo+1);
                localStorage.setItem(configData.TEMPO_PARAM, tempo);
            }, 1000);
        }

        return() => {
            clearInterval(intervalId);
        };
    }, [tempo])

    return(
        <div className='timerdiv'>
            ⏳Tempo: {tempo}
        </div>
    )
}

export default Tempo;