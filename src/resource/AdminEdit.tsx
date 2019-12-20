//@ts-ignore
import * as React from 'react';
//@ts-ignore
import { useState, useEffect } from 'react';
//@ts-ignore
import {SimpleForm, Edit, TextInput, SelectInput, required} from 'react-admin'
import config from "../config";

export const AdminEdit= (props:any) => {
    const [roles, setRoles] = useState([]);
    useEffect(() => {
            config.getRolesList().then(data => setRoles(data))
        }
    ,[])
    const choices = roles.map(role => {
        let choice = {
            id: role,
            name: role.charAt(0).toUpperCase()+role.substring(1).toLowerCase();
    }
        return choice;
    });
    return (
        <Edit {...props}>
            <SimpleForm redirect='list'>
                <TextInput source={'username'} validate={required()} />
                <TextInput source={'last_name'} />
                <TextInput source={'first_name'} />
                <TextInput source={'password'} type={'password'} />
                <SelectInput source={'role'} choices={choices} validate={required()} />
            </SimpleForm>
        </Edit>
    )
}
