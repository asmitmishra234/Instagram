import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT_KEY
});

const StorageService = {

    async uploadFile(fileBuffer, fileName) {

        const result = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
        });

        return result;
    }
};

export default StorageService;