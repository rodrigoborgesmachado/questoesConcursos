import './tempo.css';
import configData from "./../../config.json";
import { useState, useEffect } from 'react';


function converter(valueInSeconds){
    const hours = Math.floor(valueInSeconds / 3600)
    const minutes = Math.floor((valueInSeconds % 3600) / 60)
    const seconds = valueInSeconds % 60;
    return `${hours < 10 ? '0'+hours : hours}:${minutes<10 ? '0'+minutes : minutes}:${seconds<10 ? '0'+seconds : seconds}`
}

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
            Tempo decorrido: {converter(tempo)}
        </div>
    )
}

export default Tempo;