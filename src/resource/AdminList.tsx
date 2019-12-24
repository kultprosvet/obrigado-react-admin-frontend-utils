//@ts-ignore
import * as React from "react";
//@ts-ignore
import { List, Datagrid, TextField, Filter, TextInput } from "react-admin";
const AdminsFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn resettable />
  </Filter>
);
export const AdminList = (props: any) => (
  <List
    {...props}
    filter={{ graphql_fields: "id,username,last_name,first_name" }}
    filters={<AdminsFilter />}
    exporter={false}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" title={"User name"} />
      <TextField source="last_name" title={"Last name"} />
      <TextField source="first_name" title={"First name"} />
    </Datagrid>
  </List>
);
