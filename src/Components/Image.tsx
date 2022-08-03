import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
const rekognition=new AWS.Rekognition();

function Image(){
    const [url,setUrl]:[string|undefined,Function]=useState("");
    const [state,setstate]:[any|undefined,Function]=useState();
    const [image,setImage]:[any,Function]=useState("")
    function handlechange(event:any){
        encodeImageDataArrayBuffer(event.target)
        const [file]:any = event.target.files;
        setUrl(URL.createObjectURL(file));
    }
    function anonlog():void{
        AWS.config.region="eu-west-2";
        AWS.config.credentials=new AWS.CognitoIdentityCredentials({
            IdentityPoolId:"eu-west-2:371cdf1c-657e-4e3f-a6a0-3cdcf905bfdc",
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
        if (err) console.log(err, err.stack); // an error occurred
            setstate(data.FaceDetails);
            console.log(data.FaceDetails)
        });
        
    }
    function encodeImageDataArrayBuffer(element: any){
        let file : Blob = element.files[0];
        let reader = new FileReader();
        reader.onloadend = function(){
            const url=reader.result
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
                <div className='img' id='detail' >
                           
                </div>            
            </div>
        </div>
    );
}

export default Image;