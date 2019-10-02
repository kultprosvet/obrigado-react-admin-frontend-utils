//@ts-ignore
import React from 'react'
//@ts-ignore
import { Resource } from 'react-admin'
import {AdminEdit,AdminCreate,AdminList} from '../index'
export  const AdministratorResource= ( <Resource
        name="Administrator"
        title={"Administrators"}
        list={AdminList}
        edit={AdminEdit}
        create={AdminCreate}
    />)
