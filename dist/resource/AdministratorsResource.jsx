"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
const AdminList_1 = require("./AdminList");
//@ts-ignore
const react_admin_1 = require("react-admin");
const AdminEdit_1 = require("./AdminEdit");
const AdminCreate_1 = require("./AdminCreate");
exports.AdministratorResource = (<react_admin_1.Resource name="Administrator" title={"Administrators"} list={AdminList_1.default} edit={AdminEdit_1.default} create={AdminCreate_1.default}/>);
//# sourceMappingURL=AdministratorsResource.jsx.map