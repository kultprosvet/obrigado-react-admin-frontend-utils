Set of helpers for [React Admin](https://github.com/marmelab/react-admin)
# Requirments
+ React-admin
+ [Obrigado backend helper](https://github.com/kultprosvet/obrigado-react-admin-backend-utils) on server side
# Installation
Install package:
```
npm install obrigado-react-admin-frontend-utils
```
or
```
yarn add obrigado-react-admin-frontend-utils
```
# Authorization 
The obrigado-react-admin-frontend-utils package currently supports react-admin versions 2.0^ and 3.0^. Since Auth Provider and Data Provider in react-admin 2.0^ are built as function and in versions 3.0^ as classes they require different configuration.
### Auth provider for react-admin 2.0^
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
### Auth provider for react-admin 3.0^
Use AuthProviderV3 class to create an instance of auth provider. 
```javascript
import { AuthProviderV3 } from 'obrigado-react-admin-frontend-utils'
...
const apiUrl="http://localhost:3000/graphql"
const authProvider = new AuthProviderV3(apiUrl, true)


 <Admin authProvider={authProvider}>
 ...
 </Admin>
```
 
# Data provider
### Data provider for react-admin 2.0^
Use buildObrigadoDataProvider function to build dataprovider. Data provider is built asynchronously, Admin element should be displayed only when data provider is completely loaded. 

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
        const apiUrl= "http://localhost:4000/graphql"
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
### Data provider for react-admin 3.0^
Use buildDataProviderV3 function to create data provider. The function returns an instance of DataProviderV3 class. It is also asynchronous so Admin element should be displayed only when data provider is completely loaded.
```javascript
import React from 'react';
import { Admin } from 'react-admin';
import { AuthProviderV3, buildDataProviderV3} from 'obrigado-react-admin-frontend-utils';


class App extends React.Component {
  state = {
    dataProvider: null,
    authProvider: null
  }
  constructor(props) {
    super(props)
    const apiUrl = "http://localhost:4000/graphql";
    buildDataProviderV3(apiUrl).then(provider=>{
      this.setState({dataProvider: provider})
    });
    this.setState({authProvider: new AuthProviderV3(apiUrl, true)});
  }

  render() {
    if (!this.state.dataProvider) {
      return <div>Loading...</div>
    }
    return (
        <Admin 
          dataProvider={this.state.dataProvider} 
          authProvider={this.state.authProvider}>
          ...
        </Admin>
    )
  }
};

export default App;
```