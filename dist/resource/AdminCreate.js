"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const React = require("react");
//@ts-ignore
const react_1 = require("react");
//@ts-ignore prettier-ignore
const react_admin_1 = require("react-admin");
const config_1 = require("../config");
exports.AdminCreate = (props) => {
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
    return (React.createElement(react_admin_1.Create, Object.assign({}, props),
        React.createElement(react_admin_1.SimpleForm, { redirect: "list" },
            React.createElement(react_admin_1.TextInput, { source: "username", validate: react_admin_1.required() }),
            React.createElement(react_admin_1.TextInput, { source: "last_name" }),
            React.createElement(react_admin_1.TextInput, { source: "first_name" }),
            React.createElement(react_admin_1.TextInput, { source: "password", type: "password", validate: react_admin_1.required() }),
            React.createElement(react_admin_1.SelectInput, { source: "role", choices: choices, valiadte: react_admin_1.required() }))));
};
//# sourceMappingURL=AdminCreate.js.map