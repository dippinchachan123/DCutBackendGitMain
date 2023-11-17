import express from "express";
import { UserServices, LoginDetailService } from "../services";
import jwt from "jsonwebtoken";
import { config } from "../config";
import * as helper from "../helper";
import * as Message from "../utils/constants/auth.constants";
import User, { ACTIVE, BROKER, EMPLOYER } from "../model/Users";
import { getPermissions } from "../utils/scripts/permission";
import UserRole from "../model/UserRoleSchema";
// import * as GlobalMessage from "../../utils/constants/global.constants";
import * as GlobalMessage from "../utils/constants/global.constants";
import Clients from "../model/Client";
import mongoose from "mongoose";
import Employee from "../model/Employee";

interface MyUserRequest extends express.Request {
  user?: object;
}

const basicAuth = (req: MyUserRequest, res: express.Response, next: any) => {
  try {
    let token = req.headers["auth"];
    jwt.verify(
      token,
      config.auth.jwt_secret,
      async function (err: any, decoded: any) {
        if (err)
          return helper.generateErr(
            res,
            Message.ACCESS_TOKEN_IS_NOT_VALID,
            401
          );

        UserServices.getUser({ _id: decoded.data._id }, {}, {}, (err, data) => {
          if (err)
            return helper.generateErr(
              res,
              Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
              401
            );
          //if(data.length==0) return helper.generateErr(res, Message.USER_SHOULD_BE_LOGGED, 401);
          req.user = data[0];
          next();
        });
      }
    );
  } catch (error) {
    return helper.generateErr(
      res,
      Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
      401
    );
  }
};

const brokerAuth = (req: MyUserRequest, res: express.Response, next: any) => {
  let token = req.headers["auth"]; //req.cookies.auth;
  try {
    let accessControl;
    jwt.verify(
      token,
      config.auth.jwt_secret,
      async function (err: any, decoded: any) {
        if (err)
          return helper.generateErr(
            res,
            Message.ACCESS_TOKEN_IS_NOT_VALID,
            401
          );
        accessControl = getPermissions(decoded.data.userType);

        const usersRole = await UserRole.aggregate([
          {
            $match: { roleName: decoded.data.roleName },
          },
          {
            $unwind: "$perrsmission",
          },
          {
            $group: {
              _id: "$perrsmission.data.module_key",
              view: { $first: "$perrsmission.data.view" },
              edit: { $first: "$perrsmission.data.edit" },
              csv: { $first: "$perrsmission.data.csv" },
              upload: { $first: "$perrsmission.data.upload" },
              status: { $first: "$perrsmission.data.status" },
              add: { $first: "$perrsmission.data.add" },
              remove: { $first: "$perrsmission.data.remove" },
            },
          },
          {
            $project: {
              module_key: "$_id",
              view: "$view",
              edit: "$edit",
              csv: "$csv",
              upload: "$upload",
              status: "$status",
              add: "$add",
              remove: "$remove",
              _id: 0,
            },
          },
        ]);

        const usersRoleSetting = await UserRole.aggregate([
          {
            $match: { roleName: decoded.data.roleName },
          },
          {
            $unwind: "$perrsmission",
          },
          {
            $unwind: "$perrsmission.child",
          },
          {
            $unwind: "$perrsmission.child.child",
          },
          {
            $group: {
              _id: "$perrsmission.child.child.data.module_key",
              view: { $first: "$perrsmission.child.child.data.view" },
              edit: { $first: "$perrsmission.child.child.data.edit" },
              csv: { $first: "$perrsmission.child.child.data.csv" },
              upload: { $first: "$perrsmission.child.child.data.upload" },
              status: { $first: "$perrsmission.child.child.data.status" },
              add: { $first: "$perrsmission.child.child.data.add" },
              remove: { $first: "$perrsmission.child.child.data.remove" },
            },
          },
          {
            $project: {
              module_key: "$_id",
              view: "$view",
              edit: "$edit",
              csv: "$csv",
              upload: "$upload",
              status: "$status",
              add: "$add",
              remove: "$remove",
              _id: 0,
            },
          },
        ]);

        const permission = {};
        usersRole.forEach((item) => {
          permission[item.module_key] = item;
        });
        usersRoleSetting.forEach((item) => {
          permission[item.module_key] = item;
        });

        if (accessControl.length !== 2)
          return helper.generateErr(
            res,
            Message.YOU_DONT_HAVE_ACCESS_TO_THIS_ROUTE,
            401
          );

        UserServices.getUser(
          { _id: decoded.data._id },
          { password: 0, __v: 0 },
          {},
          (err, userdata) => {
            if (err)
              return helper.generateErr(
                res,
                Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
                401
              );
            //if(userdata.length==0) return helper.generateErr(res, Message.USER_SHOULD_BE_LOGGED, 401);

            LoginDetailService.getLoginDetails(
              { userId: userdata[0]._id },
              {},
              {},
              (err, data) => {
                if (err)
                  return helper.generateErr(
                    res,
                    Message.Error_WHILE_GETTING_ACCESSTOKEN_DETAILS,
                    401
                  );
                //if (data[0].validUpto === "expired") return helper.generateErr(res, "Password has been reset please login again", 401);
                if (userdata[0].status !== ACTIVE)
                  return helper.generateErr(
                    res,
                    GlobalMessage.LOGIN_STATUS_ERROR_MESSAGE,
                    401
                  );
                req.user = {
                  ...userdata[0],
                  permission,
                  expireIn: config.auth.jwt_expire_in,
                };
                next();
              }
            );
          }
        );
      }
    );
  } catch (error) {
    return helper.generateErr(
      res,
      Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
      401
    );
  }
};

const employeeAuth = (req: MyUserRequest, res: express.Response, next: any) => {
  let token = req.headers["auth"];
  try {
    let accessControl;

    jwt.verify(
      token,
      config.auth.jwt_secret,
      async function (err: any, decoded: any) {
        if (err)
          return helper.generateErr(
            res,
            Message.ACCESS_TOKEN_IS_NOT_VALID,
            401
          );
        accessControl = getPermissions(decoded.data.userType);
        // if (accessControl.length !== 1)
        //   return helper.generateErr(
        //     res,
        //     Message.YOU_DONT_HAVE_ACCESS_TO_THIS_ROUTE,
        //     401
        //   );

        //console.log(decoded.data)

          let userData = await Employee.aggregate([
            {
              $match: {
                _id: mongoose.Types.ObjectId(decoded.data.id),
              },
            },
            {
              $unwind: {
                path: "$layout",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$layout.children",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$layout.children.children",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$layout.children.children.children",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$layout.children.children.children.children",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id",
                userId: {
                  $first: "$userId",
                },
                logo: {
                  $first: "$logo",
                },
                createdBy: {
                  $first: "$createdBy",
                },
                id: {
                  $first: "$_id",
                },
                clientId: {
                  $first: {
                    $concat: [
                      "EV00",
                      {
                        $toString: "$clientId",
                      },
                    ],
                  },
                },
                createdAt: {
                  $first: "$createdAt",
                },
                updatedAt: {
                  $first: "$updatedAt",
                },
                data: {
                  $push: {
                    k: "$layout.children.children.children.children.field_lable",
                    v: "$layout.children.children.children.children.value",
                  },
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $arrayToObject: {
                    $concatArrays: [
                      [
                        {
                          k: "createdBy",
                          v: "$createdBy",
                        },
                        {
                          k: "userId",
                          v: "$userId",
                        },
                        {
                          k: "id",
                          v: "$id",
                        },
                        {
                          k: "clientId",
                          v: "$clientId",
                        },
                        {
                          k: "logo",
                          v: "$logo",
                        },
                        {
                          k: "createdAt",
                          v: "$createdAt",
                        },
                        {
                          k: "updatedAt",
                          v: "$updatedAt",
                        },
                      ],
                      "$data",
                    ],
                  },
                },
              },
            },
            { $unset: "ClientId" },
          ]);

          const localInformation = await User.findOne({
            parentsId: null,
            companyCode: userData[0].createdBy
          }, )

          //console.log({userData, localInformation})

       
          if (userData.length == 0)
            return helper.generateErr(res, Message.USER_SHOULD_BE_LOGGED, 401);
          req.user = {
            ...userData[0], 
            localInformation: localInformation.localInformation, 
            organizationDetails: {...localInformation.organizationDetails, logo: localInformation.logo },
            userType: "EMPLOYEE"
          };
          next();
      }
    );
  } catch (error) {
    return helper.generateErr(
      res,
      Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
      401
    );
  }
};

const employerAuth = async (
  req: MyUserRequest,
  res: express.Response,
  next: any
) => {
  const token = req.headers["auth"];
  try {
    let users: any = req.user;
    if (users && users.userType === "EMPLOYER") {
      const usersRole = await UserRole.aggregate([
        {
          $match: { roleName: users.roleName },
        },
        {
          $unwind: "$perrsmission",
        },
        {
          $group: {
            _id: "$perrsmission.data.module_key",
            view: { $first: "$perrsmission.data.view" },
            edit: { $first: "$perrsmission.data.edit" },
            csv: { $first: "$perrsmission.data.csv" },
            upload: { $first: "$perrsmission.data.upload" },
            status: { $first: "$perrsmission.data.status" },
            add: { $first: "$perrsmission.data.add" },
            remove: { $first: "$perrsmission.data.remove" },
          },
        },
        {
          $project: {
            module_key: "$_id",
            view: "$view",
            edit: "$edit",
            csv: "$csv",
            upload: "$upload",
            status: "$status",
            add: "$add",
            remove: "$remove",
            _id: 0,
          },
        },
      ]);

      const usersRoleSetting = await UserRole.aggregate([
        {
          $match: { roleName: users.roleName },
        },
        {
          $unwind: "$perrsmission",
        },
        {
          $unwind: "$perrsmission.child",
        },
        {
          $unwind: "$perrsmission.child.child",
        },
        {
          $group: {
            _id: "$perrsmission.child.child.data.module_key",
            view: { $first: "$perrsmission.child.child.data.view" },
            edit: { $first: "$perrsmission.child.child.data.edit" },
            csv: { $first: "$perrsmission.child.child.data.csv" },
            upload: { $first: "$perrsmission.child.child.data.upload" },
            status: { $first: "$perrsmission.child.child.data.status" },
            add: { $first: "$perrsmission.child.child.data.add" },
            remove: { $first: "$perrsmission.child.child.data.remove" },
          },
        },
        {
          $project: {
            module_key: "$_id",
            view: "$view",
            edit: "$edit",
            csv: "$csv",
            upload: "$upload",
            status: "$status",
            add: "$add",
            remove: "$remove",
            _id: 0,
          },
        },
      ]);

      const permission = {};
      usersRole.forEach((item) => {
        permission[item.module_key] = item;
      });
      usersRoleSetting.forEach((item) => {
        permission[item.module_key] = item;
      });
      const parent = await Clients.findById(mongoose.Types.ObjectId(users.createdBy));
      const localInformantion = await User.findOne({
        companyCode: parent.createdBy,
      });
      req.user = {
        ...users,
        localInformation: localInformantion.localInformation,
        permission,
      };

      return next();
    }

    let accessControl;
    jwt.verify(
      token,
      config.auth.jwt_secret,
      async function (err: any, decoded: any) {
        if (err)
          return helper.generateErr(
            res,
            Message.ACCESS_TOKEN_IS_NOT_VALID,
            401
          );
        accessControl = getPermissions(decoded.data.userType);
        if (decoded.data.userType !== EMPLOYER)
          return helper.generateErr(
            res,
            Message.YOU_DONT_HAVE_ACCESS_TO_THIS_ROUTE,
            401
          );

        let userData = await Clients.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(decoded.data._id),
            },
          },
          {
            $unwind: {
              path: "$layout",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$layout.children",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$layout.children.children",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$layout.children.children.children",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$layout.children.children.children.children",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              userId: {
                $first: "$userId",
              },
              logo: {
                $first: "$logo",
              },
              createdBy: {
                $first: "$createdBy",
              },
              id: {
                $first: "$_id",
              },
              clientId: {
                $first: {
                  $concat: [
                    "EV00",
                    {
                      $toString: "$clientId",
                    },
                  ],
                },
              },
              createdAt: {
                $first: "$createdAt",
              },
              updatedAt: {
                $first: "$updatedAt",
              },
              data: {
                $push: {
                  k: "$layout.children.children.children.children.field_lable",
                  v: "$layout.children.children.children.children.value",
                },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $arrayToObject: {
                  $concatArrays: [
                    [
                      {
                        k: "createdBy",
                        v: "$createdBy",
                      },
                      {
                        k: "userId",
                        v: "$userId",
                      },
                      {
                        k: "id",
                        v: "$id",
                      },
                      {
                        k: "clientId",
                        v: "$clientId",
                      },
                      {
                        k: "logo",
                        v: "$logo",
                      },
                      {
                        k: "createdAt",
                        v: "$createdAt",
                      },
                      {
                        k: "updatedAt",
                        v: "$updatedAt",
                      },
                    ],
                    "$data",
                  ],
                },
              },
            },
          },
          { $unset: "ClientId" },
        ]);

        // This is used for general emplyer user start
        if (userData.length === 0)
          return helper.generateErr(res, Message.USER_SHOULD_BE_LOGGED, 401);
        let localInformantion = await User.findOne({
          companyCode: userData[0].createdBy,
        });
        req.user = {
          ...userData[0],
          localInformation: localInformantion.localInformation,
        };
        next();
      }
    );
  } catch (error) {
    return helper.generateErr(
      res,
      Message.ERROR_WHILE_FEATCHING_USER_DETAILS,
      401
    );
  }
};

export { basicAuth, brokerAuth, employeeAuth, employerAuth };
