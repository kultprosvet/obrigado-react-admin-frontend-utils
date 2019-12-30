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
  BooleanInput,
  required
  //@ts-ignore
} from "react-admin";
import config from "../config";

export const AdminCreate = ({ permissions, ...props }) => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    config.getRolesList().then(data => setRoles(data));
  }, []);
  //@ts-ignore
  const choices = roles.map(role => {
    let choice = {
      id: role,
      name: role.charAt(0).toUpperCase() + role.substring(1).toLowerCase()
    };
    return choice;
  });
  return (
    <Create {...props}>
      <SimpleForm redirect="list">
        <TextInput source={"username"} validate={required()} />
        <TextInput source={"last_name"} />
        <TextInput source={"first_name"} />
        <TextInput
          source={"password"}
          type={"password"}
          validate={required()}
        />
        <SelectInput source={"role"} choices={choices} valiadte={required()} />
      </SimpleForm>
    </Create>
  );
};
