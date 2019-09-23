//@ts-ignore
import React from 'react'
//@ts-ignore prettier-ignore
import {SimpleForm, Create, TextInput,} from 'react-admin'

export default (props:any) => {
    console.log(props)
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source={'username'} />
                <TextInput source={'last_name'} />
                <TextInput source={'first_name'} />
                <TextInput source={'password'} />
            </SimpleForm>
        </Create>
    )
}
