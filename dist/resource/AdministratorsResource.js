"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
const index_1 = require("../index");
exports.AdministratorResource = (react_1.default.createElement(react_admin_1.Resource, { name: "Administrator", title: "Administrators", list: index_1.AdminList, edit: index_1.AdminEdit, create: index_1.AdminCreate }));
//# sourceMappingURL=AdministratorsResource.js.map