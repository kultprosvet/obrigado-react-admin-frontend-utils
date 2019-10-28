Set of helpers for [React Admin](https://github.com/marmelab/react-admin)
# Requirments
+ React-admin
+ [Obrigado backend helper](https://github.com/kultprosvet/obrigado-react-admin-backend-utils) on server side
# Installation
Install package:
```
npm install git+https://github.com:kultprosvet/obrigado-react-admin-frontend-utils.git#1.1.5
```
or
```
yarn add git+https://github.com:kultprosvet/obrigado-react-admin-frontend-utils.git#1.1.5
```
# Authorization
Use buildAuthProvider to create auth provider, add  AdministratorResource to resources to display default ui for administrators management.
```javascript
import {buildAuthProvider,AdministratorResource} from 'obrigado-react-admin-frontend-utils'
...
const apiUrl="http://localhost:3000/graphql"
const authProvider=buildAuthProvider(apiUrl,true)
... 
 <Admin
                title={'App'}
                ...
                authProvider={authProvider}
            >
                {permissions => {
                    console.log('permissions',permissions)
                    return [
                        AdministratorResource,
                    ]
                }}
            </Admin>
```
 
# Data provider
Use buildObrigadoDataProvider to build dataprovider. Data provider is built asynchronously, Admin element should be displayed only when data provider is completely loaded. 

``` javascript
import React from 'react';
import './App.css';
import { Admin } from 'react-admin'
import {buildObrigadoDataProvider,buildAuthProvider,AdministratorResource} from 'obrigado-react-admin-frontend-utils'


class App extends React.Component{
    state = {
        dataProvider: null,
        authProvider:null
    }
    constructor(props){
        super(props)
        const apiUrl= "http://localhost:3000/graphql"
        buildObrigadoDataProvider(apiUrl).then(provider=>{
            this.setState({dataProvider:provider})
        })
        this.state.authProvider=buildAuthProvider(apiUrl,true)
    }
    render() {
        if (!this.state.dataProvider) {
            return <div>Loading schema</div>
        }
        return (
            <Admin
                title={'App'}
                dataProvider={this.state.dataProvider}
                authProvider={this.state.authProvider}
            >
                {permissions => {
                    console.log('permissions',permissions)
                    return [
                        AdministratorResource,

                    ]
                }}
            </Admin>
        );
    }
}

export default App;

```