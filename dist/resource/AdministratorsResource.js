"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
const AdminList_1 = require("./AdminList");
const AdminEdit_1 = require("./AdminEdit");
const AdminCreate_1 = require("./AdminCreate");
exports.AdministratorResource = (react_1.default.createElement(react_admin_1.Resource, { name: "Administrator", title: "Administrators", list: AdminList_1.AdminList, edit: AdminEdit_1.AdminEdit, create: AdminCreate_1.AdminCreate }));
//# sourceMappingURL=AdministratorsResource.js.map