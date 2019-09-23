"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_1 = require("react");
//@ts-ignore
const react_admin_1 = require("react-admin");
const AdminsFilter = (props) => (<react_admin_1.Filter {...props}>
        <react_admin_1.TextInput label="Search" source="q" alwaysOn resettable/>
    </react_admin_1.Filter>);
exports.default = (props) => (<react_admin_1.List {...props} filter={{ graphql_fields: "id,username,last_name,first_name" }} filters={<AdminsFilter />} rowClick="edit">
        <react_admin_1.Datagrid rowClick="edit">
            <react_admin_1.TextField source="id"/>
            <react_admin_1.TextField source="username" title={"User name"}/>
            <react_admin_1.TextField source="last_name" title={"Last name"}/>
            <react_admin_1.TextField source="first_name" title={"First name"}/>
        </react_admin_1.Datagrid>
    </react_admin_1.List>);
//# sourceMappingURL=AdminList.jsx.map