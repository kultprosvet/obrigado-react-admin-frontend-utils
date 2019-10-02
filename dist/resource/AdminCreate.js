"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore prettier-ignore
const react_admin_1 = require("react-admin");
exports.AdminCreate = (props) => {
    //console.log(props)
    return (react_1.default.createElement(react_admin_1.Create, Object.assign({}, props),
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: 'username' }),
            react_1.default.createElement(react_admin_1.TextInput, { source: 'last_name' }),
            react_1.default.createElement(react_admin_1.TextInput, { source: 'first_name' }),
            react_1.default.createElement(react_admin_1.TextInput, { source: 'password' }))));
};
//# sourceMappingURL=AdminCreate.js.map