//@ts-ignore
import * as React from 'react'
//@ts-ignore
import {SimpleForm, Edit, TextInput,} from 'react-admin'


export const AdminEdit= (props:any) => {
    //console.log(props)
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source={'username'} />
                <TextInput source={'last_name'} />
                <TextInput source={'first_name'} />
                <TextInput source={'password'} />
            </SimpleForm>
        </Edit>
    )
}
