import { Router } from 'express';
import { premiumController, getUsers , uploadDocuments, deleteUser} from '../controllers/usersController.js';
import upload from '../middlewares/multerConfig.js'
import { passportCall} from "../utils/utils.js";

const router = Router()
router.get('/premium/:uid' , passportCall('jwt'), premiumController);
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);
router.get('/' , getUsers);
router.delete('/:uid' , deleteUser);

export default router;