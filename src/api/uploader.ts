import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'src/api/firebase';

export const uploadImage = async (chatRoomId: string, file: File) => {
    const metadata = { contentType: file.type };
    return new Promise<string>((resolve, reject) => {
        try {
            const storageRef = ref(storage, `/message/${chatRoomId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            reject(error);
                            break;
                        case 'storage/canceled':
                            reject(error);
                            break;
                        case 'storage/unknown':
                            reject(error);
                            break;
                    }
                },
                async () => {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadUrl);
                },
            );
        } catch (error) {
            console.log(error);
        }
    });
};
