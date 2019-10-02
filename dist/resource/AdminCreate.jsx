"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore prettier-ignore
const react_admin_1 = require("react-admin");
exports.AdminCreate = (props) => {
    //console.log(props)
    return (<react_admin_1.Create {...props}>
            <react_admin_1.SimpleForm>
                <react_admin_1.TextInput source={'username'}/>
                <react_admin_1.TextInput source={'last_name'}/>
                <react_admin_1.TextInput source={'first_name'}/>
                <react_admin_1.TextInput source={'password'}/>
            </react_admin_1.SimpleForm>
        </react_admin_1.Create>);
};
//# sourceMappingURL=AdminCreate.jsx.map