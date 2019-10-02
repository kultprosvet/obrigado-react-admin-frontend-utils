"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const React = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
const AdminsFilter = (props) => (React.createElement(react_admin_1.Filter, Object.assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: "Search", source: "q", alwaysOn: true, resettable: true })));
exports.AdminList = (props) => (React.createElement(react_admin_1.List, Object.assign({}, props, { filter: { graphql_fields: "id,username,last_name,first_name" }, filters: React.createElement(AdminsFilter, null), rowClick: "edit" }),
    React.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "username", title: "User name" }),
        React.createElement(react_admin_1.TextField, { source: "last_name", title: "Last name" }),
        React.createElement(react_admin_1.TextField, { source: "first_name", title: "First name" }))));
//# sourceMappingURL=AdminList.js.map