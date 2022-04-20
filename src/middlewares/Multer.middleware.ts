import multer from 'multer';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads');
    }
});

export const multerMiddleware = multer({ storage: storageConfig }).array('files');
