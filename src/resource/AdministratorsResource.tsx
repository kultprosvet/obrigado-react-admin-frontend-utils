//@ts-ignore
import React from 'react'
import AdminList from './AdminList'
//@ts-ignore
import { Resource } from 'react-admin'
import AdminEdit from './AdminEdit'
import AdminCreate from './AdminCreate'
export  const AdministratorResource= ( <Resource
        name="Administrator"
        title={"Administrators"}
        list={AdminList}
        edit={AdminEdit}
        create={AdminCreate}
    />)
