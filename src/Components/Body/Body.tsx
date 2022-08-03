
import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import './Body.css';
const rekognition=new AWS.Rekognition();
function Body(){
    const [url,setUrl]:[string|undefined,Function]=useState("");
    const [state,setstate]:[any|undefined,Function]=useState();
    const [image,setImage]:[any,Function]=useState("")
    function handlechange(event:any){
        encodeImageDataArrayBuffer(event.target)
        const [file]:any = event.target.files;
        setUrl(URL.createObjectURL(file));
    }
    function anonlog():void{
        AWS.config.correctClockSkew=true;
        AWS.config.region=process.env.REACT_APP_REGION;
        AWS.config.credentials=new AWS.CognitoIdentityCredentials({
            IdentityPoolId:process.env.REACT_APP_PULL_IP as string,
        });
    }
    function ProcessImage():void{
        anonlog();
        const params = {
            Image: {
            Bytes: image
          },
          Attributes: [
          'ALL',
        ]
      };
        rekognition.detectFaces(params, function (err, data) {
            if (err){
                console.error(err);
                console.log("err");
            }
               
            if(!err) {
                setstate(data.FaceDetails);
            }
        });
    }
    function encodeImageDataArrayBuffer(element: any){
        let file : Blob = element.files[0];
        let reader = new FileReader();
        reader.onloadend = function(){
            const url=reader.result;
            setImage(url);
        }
        reader.readAsArrayBuffer(file);
    }
    useEffect(()=>{
        if(image!==""){
            ProcessImage();
        }
    },[image]);
    return(
        <div className='body'>
            <input type="file" className="input" onInput={handlechange}/>
            <div className='row'>
                <div className='img' id='image'>
                    <img src={url} alt=""/>
                </div>
                
                <div className='img' id='detail'>
                <h3>Information: </h3>
                    <div className='container-row'>
                        <div className='Roww'>
                        <h3>Age</h3>
                            <h5>High: </h5>
                                {state !==undefined && <p>{state[0].AgeRange.High}</p>}
                            <h5>Low: </h5>
                                {state !==undefined && <p>{state[0].AgeRange.Low}</p>}
                        <h3>Beard: </h3>
                            <h5>Confidence: </h5>
                                {state !==undefined && <p>{state[0].Beard.Confidence}</p>}
                            <h5>Value: </h5>
                                {state !==undefined && <p>{state[0].Beard.Value}</p>}
                        <h3>Gender: </h3>
                            <h5>Confidence: </h5>
                                {state !==undefined && <p>{state[0].Gender.Confidence}</p>}
                        <h5>Value: </h5>
                                {state !==undefined && <p>{state[0].Gender.Value}</p>}
                        <h3>Mustache: </h3> 
                            <h5>Confidence: </h5>  
                                {state !==undefined && <p> {state[0].Mustache.Confidence}</p>}
                            <h5>Value: </h5>
                                {state !==undefined && <p> {state[0].Mustache.Value}</p>}
                        </div>
                        <div className='Roww' id='row'>
                            <h3>Quality: </h3>
                                <h5>Brightness: </h5>
                                    {state !==undefined && <p>{state[0].Quality.Brightness}</p>}
                                <h5>Sharpness: </h5>
                                    {state !==undefined && <p>{state[0].Quality.Sharpness}</p>}
                            <h3>Smile: </h3>
                                <h5>confidence: </h5>
                                    {state !==undefined && <p> {state[0].Smile.Confidence}</p>}
                                <h5>Value: </h5>
                                    {state !==undefined && <p> {state[0].Smile.Value}</p>}
                            <h3>Sunglasse: </h3>
                                <h5>Confidence: </h5>
                                    {state !==undefined && <p>{state[0].Sunglasses.Confidence}</p>}
                                <h5>Value: </h5>
                                    {state !==undefined && <p>{state[0].Sunglasses.Value}</p>}
                            <h3>Eyeglasses: </h3>
                                <h5>Confidence: </h5>
                                    {state !==undefined && <p>{state[0].Eyeglasses.Confidence}</p>}
                                <h5>Value: </h5>
                                    {state !==undefined && <p>{state[0].Eyeglasses.Value}</p>}
                                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Body;