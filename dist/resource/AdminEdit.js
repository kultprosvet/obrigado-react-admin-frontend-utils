"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const React = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
exports.AdminEdit = (props) => {
    //console.log(props)
    return (React.createElement(react_admin_1.Edit, Object.assign({}, props),
        React.createElement(react_admin_1.SimpleForm, null,
            React.createElement(react_admin_1.TextInput, { source: 'username' }),
            React.createElement(react_admin_1.TextInput, { source: 'last_name' }),
            React.createElement(react_admin_1.TextInput, { source: 'first_name' }),
            React.createElement(react_admin_1.TextInput, { source: 'password' }))));
};
//# sourceMappingURL=AdminEdit.js.map