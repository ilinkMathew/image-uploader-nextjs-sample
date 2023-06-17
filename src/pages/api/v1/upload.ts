import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import { v2 as cloudinary } from 'cloudinary'
import IncomingForm from "formidable/Formidable";
// Configuration 
cloudinary.config({
    cloud_name: "djxaeir34",
    api_key: "256844783785341",
    api_secret: "NPTjgrov21S1lBdEvq3unR5Knb4"
});

type FileMeta = {
    path: string;
    name: string
}

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const form = formidable({ multiples: false });
        try {
            const fileMeta = await extractFormBody(req, form)
            const imageURL = await uploadToCloudinary(fileMeta)
            res.json({ uploadedImageUrl: imageURL });
        } catch (e) {
            console.error(e);
            res.json({ error: 'failed to parse file' });
            res.status(400)
        }

    }
}

function extractFormBody(req: NextApiRequest, form: IncomingForm): Promise<FileMeta | any> {
    return new Promise((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
            if (err) return reject(err);
            return resolve({ path: files['imageFile']['filepath'], name: sanitizeFileNames(fields['imageName']) })
        })
    })
}

function sanitizeFileNames(filename: string) {
    return path.parse(filename.replaceAll(' ', '_')).name
}


async function uploadToCloudinary(imageData: any) {
    try {
        const data = await cloudinary.uploader.upload(imageData.path, { public_id: imageData.name });
        return data.url
    } catch (e) {
        console.log('failed to upload to cloudinary')
        console.error(e);
    }
}