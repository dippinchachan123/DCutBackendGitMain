import express from 'express';
import * as authController from '../../controller/auth';
import { basicAuth, brokerAuth, employeeAuth, employerAuth } from '../../middleware/auth';
import * as helper from '../../helper';

const authRouter = express.Router();

interface MyUserRequest extends express.Request {
    user?: object;
}

////////////////////////////////////For testing Purpose only////////////////////////////////
authRouter.get('/broker/check', basicAuth, brokerAuth, (req: MyUserRequest, res: express.Response) => {
    //console.log("Check Passed!", req.user);
    helper.generateSucc(res, 'User Logged in!', req.user);
    //res.json(req.user)
})

authRouter.get('/employee/check', basicAuth, employeeAuth, (req: MyUserRequest, res: express.Response) => {
    //console.log("Check Passed!", req.user);
    helper.generateSucc(res, 'User Logged in!', req.user);
})

authRouter.get('/employer/check', basicAuth, employerAuth, (req: MyUserRequest, res: express.Response) => {
    //console.log("Check Passed!", req.user);
    helper.generateSucc(res, 'User Logged in!', req.user);
})

/////////////////////////////////testing ends here///////////////////////////////////////////

authRouter.post('/register', authController.register.postAction);
authRouter.post('/genrateToken', authController.genrateToken.postAction);
authRouter.post('/login', authController.login.postAction);
authRouter.post('/employer-login', authController.login.employerLogin);
authRouter.post('/logout', basicAuth, authController.logout.postAction);
authRouter.post('/forget-password', authController.forgetPassword.postAction);
authRouter.post('/reset-password', authController.resetPassword.postAction);

//users 
authRouter.delete('/users', authController.userRole.deletUserData);
authRouter.get('/users', authController.userRole.getUserData);
authRouter.patch('/update-user-details', basicAuth, authController.userRole.updateUserData);
authRouter.post('/get-parents-users', basicAuth, authController.userRole.getParentsUsersData);
authRouter.patch('/users-status-update', basicAuth, authController.userRole.userStatusUpdate);

// Users Role 
authRouter.post('/users-role', basicAuth, authController.userRole.postUsersRole);
authRouter.post('/get-users-role', basicAuth, authController.userRole.getUsersRole);
authRouter.delete('/users-role', basicAuth, authController.userRole.deletUsersRoleData);
authRouter.patch('/update-user-role-details', basicAuth, authController.userRole.updateUserRoleData);
authRouter.get('/users-role', basicAuth, authController.userRole.getUserRoleData);

export { authRouter }