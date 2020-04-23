//@ts-ignore
import * as React from "react";
//@ts-ignore
import { useState, useEffect } from "react";
import {
  SimpleForm,
  Edit,
  TextInput,
  SelectInput,
  BooleanInput,
  required
  //@ts-ignore
} from "react-admin";
import config from "../config";

export const AdminEdit = ({ permissions, ...props }:{permissions:any[]}) => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    config.getRolesList().then(data => setRoles(data));
  }, []);

  return (
    <Edit {...props}>
      <SimpleForm redirect="list">
        <TextInput source={"username"} validate={required()} />
        <TextInput source={"email"} type="email" />
        <TextInput source={"last_name"} />
        <TextInput source={"first_name"} />
        <TextInput source={"password"} type={"password"} />
        <SelectInput source={"role"} choices={roles} validate={required()} />
        <BooleanInput source={"isBlocked"} />
      </SimpleForm>
    </Edit>
  );
};
