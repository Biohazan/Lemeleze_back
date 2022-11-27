const multer = require('multer')

const MYME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
            callback(null, './images');
        
    },
    filename: (req, file, callback) => {
        console.log(file.originalname)
        const name = file.originalname.split(".WEBP").join('_')
        const extension = MYME_TYPES[file.mimetype]
        console.log(Date.now())
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage: storage }).single('image')