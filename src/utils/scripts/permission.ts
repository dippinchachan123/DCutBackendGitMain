import { EMPLOYER, EMPLOYEE, BROKER } from "../../model/Users";

export const getPermissions = (userType) => {
    let accessControl
    //permission feature yet to disscuss
    let permissions = ["read", "write", "delete"];

    if (userType == BROKER) {
        accessControl = [EMPLOYER, EMPLOYEE];
    } else if (userType == EMPLOYER) {
        accessControl = [EMPLOYEE];
    } else {
        accessControl = [];
    }

    return accessControl;
}