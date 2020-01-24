"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const React = require("react");
//@ts-ignore
const react_1 = require("react");
const react_admin_1 = require("react-admin");
const config_1 = require("../config");
exports.AdminEdit = (_a) => {
    var { permissions } = _a, props = __rest(_a, ["permissions"]);
    const [roles, setRoles] = react_1.useState([]);
    react_1.useEffect(() => {
        config_1.default.getRolesList().then(data => setRoles(data));
    }, []);
    //@ts-ignore
    const choices = roles.map(role => {
        let choice = {
            id: role,
            name: role.charAt(0).toUpperCase() + role.substring(1).toLowerCase()
        };
        return choice;
    });
    return (React.createElement(react_admin_1.Edit, Object.assign({}, props),
        React.createElement(react_admin_1.SimpleForm, { redirect: "list" },
            React.createElement(react_admin_1.TextInput, { source: "username", validate: react_admin_1.required() }),
            React.createElement(react_admin_1.TextInput, { source: "last_name" }),
            React.createElement(react_admin_1.TextInput, { source: "first_name" }),
            React.createElement(react_admin_1.TextInput, { source: "password", type: "password" }),
            React.createElement(react_admin_1.SelectInput, { source: "role", choices: choices, validate: react_admin_1.required() }),
            React.createElement(react_admin_1.BooleanInput, { source: "isBlocked" }))));
};
//# sourceMappingURL=AdminEdit.js.map