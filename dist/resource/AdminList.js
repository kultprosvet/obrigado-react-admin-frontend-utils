"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
const AdminsFilter = (props) => (react_1.default.createElement(react_admin_1.Filter, Object.assign({}, props),
    react_1.default.createElement(react_admin_1.TextInput, { label: "Search", source: "q", alwaysOn: true, resettable: true })));
exports.AdminList = (props) => (react_1.default.createElement(react_admin_1.List, Object.assign({}, props, { filter: { graphql_fields: "id,username,last_name,first_name" }, filters: react_1.default.createElement(AdminsFilter, null), rowClick: "edit" }),
    react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "username", title: "User name" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "last_name", title: "Last name" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "first_name", title: "First name" }))));
//# sourceMappingURL=AdminList.js.map