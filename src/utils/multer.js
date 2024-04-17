import __dirname from "../../utils.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determinar la carpeta de destino en función del tipo de archivo
        let uploadFolder;
        if (file.fieldname === 'avatar') {
            uploadFolder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            uploadFolder = 'products';
        } else if (file.fieldname === 'documents'){
            uploadFolder = 'documents';
        } else {
            uploadFolder = "img"
        }
        cb(null, `${__dirname}/src/public/assets/${uploadFolder}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({
    storage,
    // Si se genera algún error, lo capturamos
    onError: function (err, next) {
        console.log(err);
        next();
    }
});