//@ts-ignore
import * as React from "react";
//@ts-ignore
import { useState, useEffect } from "react";
//@ts-ignore prettier-ignore
import {
  SimpleForm,
  Create,
  TextInput,
  SelectInput,
  required
  //@ts-ignore
} from "react-admin";
import config from "../config";

export const AdminCreate = ({ permissions, ...props }:{permissions:any[],[key:string]:any}) => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    config.getRolesList().then(data => setRoles(data));
  }, []);

  return (
    <Create {...props}>
      <SimpleForm redirect="list">
        <TextInput source={"username"} validate={required()} />
        <TextInput source={"email"} type="email" />
        <TextInput source={"last_name"} />
        <TextInput source={"first_name"} />
        <TextInput
          source={"password"}
          type={"password"}
          validate={required()}
        />
        <SelectInput source={"role"} choices={roles} validate={required()} />
      </SimpleForm>
    </Create>
  );
};
