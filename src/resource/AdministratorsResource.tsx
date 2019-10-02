//@ts-ignore
import React from 'react'
//@ts-ignore
import { Resource } from 'react-admin'
import {AdminList} from "./AdminList";
import {AdminEdit} from "./AdminEdit";
import {AdminCreate} from "./AdminCreate";

export  const AdministratorResource= ( <Resource
        name="Administrator"
        title={"Administrators"}
        list={AdminList}
        edit={AdminEdit}
        create={AdminCreate}
    />)
