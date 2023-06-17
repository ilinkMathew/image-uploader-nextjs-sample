'use client'
import { FaCloudUploadAlt } from "react-icons/fa";

import { BsFillCheckCircleFill } from 'react-icons/bs'
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from "react";
type Props = {}
type UploaderProps = {}
type UploadedImageProps = {
  imageUrl: string
}

type UploaderCallbacks = {
  statusFn: (status: Status) => void,
  imageFn: (url: string) => void

}


enum Status {
  DEFAULT,
  UPLOADING,
  UPLOADED
}

/**
 * Set status, CAll API to upload and get the imageUR, Set Image URL
 * @param event 
 * @param cb 
 */
async function uploaderFileHandler(event: React.ChangeEvent<HTMLInputElement>, cb: UploaderCallbacks) {

  const imageFile = event.target.files?.item(0);
  console.log(imageFile)
  cb.statusFn(Status.UPLOADING);
  const res = await uploadFile(imageFile!)
  cb.imageFn(res['uploadedImageUrl'])
  cb.statusFn(Status.UPLOADED)

}

/**
 * API call to server 
 * Async func
 * @param file 
 */
async function uploadFile(file: File) {
  console.log(file);
  if (file !== undefined || file !== null) {
    const formData = new FormData();
    formData.append('imageName', file.name)
    formData.append('imageFile', file!);
    try {
      const response = await fetch('http://localhost:3000/api/v1/upload', {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      return result;
    }
    catch (e) {
      console.error(e)
    }

  }

}

function dragEventHandler(event: React.DragEvent<HTMLDivElement>) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

/**
 * Set status, CAll API to upload and get the imageUR, Set Image URL
 * @param event 
 * @param cb 
 */
async function dropEventHandler(event: React.DragEvent<HTMLDivElement>, cb: UploaderCallbacks) {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  const imageFile = fileList.item(0)
  cb.statusFn(Status.UPLOADING);
  const res = await uploadFile(imageFile!)
  cb.imageFn(res['uploadedImageUrl'])
  cb.statusFn(Status.UPLOADED)

}


function Uploader({ }: UploaderProps) {
  const [status, setStatus] = useState(Status.DEFAULT)
  const [imageURL, setImageURL] = useState('https://placehold.co/300x300');
  if (status === Status.DEFAULT) {
    return (
      <div className="container">
        <h3 className={`text-[#4F4F4F] text-lg p-7`}>Upload your image</h3>
        <p className={`text-[#828282] text-xs  p-4`}> File should be jpeg,png...</p>
        <DragAndDrop statusFn={setStatus} imageFn={setImageURL} />
        <p className={` text-[#828282] p-4`}> or</p>
        <input className={`bg-blue-500 text-sm text-white p-2 w-75 rounded mb-8`} type="file" onChange={($event) => uploaderFileHandler($event, { statusFn: setStatus, imageFn: setImageURL })} name="file upload btn " accept=" .jpg, .jpeg, .png" />
      </div>
    )
  }

  if (status === Status.UPLOADING)
    return <LoaderComp />

  if (status === Status.UPLOADED)
    return <UploadedImage imageUrl={imageURL} />

  return null

}

async function copyLink(imageUrl:string){
 await navigator.clipboard.writeText(imageUrl);
 alert(`Copied text is ${imageUrl}`);
}

function UploadedImage(props: UploadedImageProps) {
  const [imageURL, setImageURL] = useState(props.imageUrl);
  return (
    <div className="container">
      <BsFillCheckCircleFill className={`mt-6 mb-auto ml-auto mr-auto w-8 h-8 text-green-500`} />
      <h3 className={`text-[#4F4F4F] text-lg p-7 pt-2`}>Uploaded Successfully!</h3>
      <div className={`w-11/12 m-auto mb-5 h-48 rounded-md  bg-cover bg-center`}
        style={{ backgroundImage: `url(${imageURL})` }}
      >
      </div>
      <div className={`w-11/12 m-auto mb-5 rounded-md bg-[#F6F8FB] flex justify-between p-3 border-2 border-[#f6f7fb]`}>
        <input className={` w-11/12 bg-[#F6F8FB]  `} type='text' name="image-url" defaultValue={imageURL} />
        <input className={`bg-blue-500 text-sm text-white w-1/2 h-9 rounded-md`} type='button' onClick={($event)=>copyLink(props.imageUrl)} value="Copy link" />
      </div>
    </div>)
}

function DragAndDrop(props: UploaderCallbacks) {
  return (
    <div className={`container w-5/6 bg-[#F6F8FB]  p-8 m-auto  border-dashed border-[#97BEF4] border text-center`} onDragOver={($event) => dragEventHandler($event)} onDrop={($event) => dropEventHandler($event, props)}>
      <FaCloudUploadAlt className={`m-auto w-10 h-10  text-orange-500`} />
      <p className={`text-[#BDBDBD] text-xs pt-3`}> Drag & Drop your image here</p>
    </div>
  )
}

function LoaderComp({ }: Props) {
  return (
    <div className="container w-4/5 m-auto pl-2 p-4 pr-2 pb-15">
      <h3 className={`text-[#4F4F4F] text-lg text-left mt-4`}>Uploading......</h3>
      <LinearProgress className={`mt-4 mb-8`} />
    </div>)
}



export {
  Uploader,
  LoaderComp,
  UploadedImage
} 