"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.USER_ROLE = void 0;
// user.interface.ts
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["OWNER"] = "ADMIN";
    USER_ROLE["USER"] = "USER";
    USER_ROLE["SUPER_ADMIN"] = "SUPER_ADMIN";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
var IStatus;
(function (IStatus) {
    IStatus["PENDING"] = "PENDING";
    IStatus["APPROVED"] = "APPROVED";
    IStatus["REJECTED"] = "REJECTED";
    IStatus["COMPLETED"] = "COMPLETED";
    IStatus["ACTIVE"] = "ACTIVE";
    IStatus["INACTIVE"] = "INACTIVE";
    IStatus["EXPIRED"] = "EXPIRED";
    IStatus["BLOCKED"] = "BLOCKED";
    IStatus["SUSPENDED"] = "SUSPENDED";
    IStatus["DELETED"] = "DELETED";
})(IStatus || (exports.IStatus = IStatus = {}));
