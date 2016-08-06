// Name: {routes.jsx}
// Module: {Front-end}
// Location: {MaaS/client/scripts/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Redirect = ReactRouter.Redirect;
var hashHistory = ReactRouter.hashHistory;

var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
var Register = require('./components/Register.react.jsx');
var Login = require('./components/Login.react.jsx');
var ResetPwd = require('./components/ResetPwd.react.jsx');
var Profile = require('./components/Profile/Profile.react.jsx');
var ChangeAvatar = require('./components/Profile/ChangeAvatar.react.jsx');
var PersonalData = require('./components/Profile/PersonalData.react.jsx');
var ChangePassword = require('./components/Profile/ChangePassword.react.jsx');
var DeleteAccount = require('./components/Profile/DeleteAccount.react.jsx');
var Company = require('./components/Company/Company.react.jsx');
var ExternalDatabases = require('./components/Company/ExternalDatabases.react.jsx');
var People = require('./components/Company/People.react.jsx');
var ManageDSL = require('./components/DSL/ManageDSL.react.jsx');
var ManageDSLSource = require('./components/DSL/ManageDSLSource.react.jsx');
var ManageDSLPermissions = require('./components/DSL/ManageDSLPermissions.react.jsx');
var DeleteCompany = require('./components/Company/DeleteCompany.react.jsx');
var Editor = require('./components/Editor.react.jsx');
var Error404 = require('./components/Error404.react.jsx');
var ManageActiveDashboard = require('./components/ManageActiveDashboard.react.jsx');
var EditorConfig = require('./components/EditorConfig.react.jsx');
var DashboardSuperAdmin = require('./components/SuperAdmin/DashboardSuperAdmin.react.jsx');
var DatabaseManagement = require('./components/SuperAdmin/DatabaseManagement.react.jsx');
var CompaniesManagement = require('./components/SuperAdmin/CompaniesManagement.react.jsx');
var UsersManagement = require('./components/SuperAdmin/UsersManagement.react.jsx');
var ImpersonateUser = require('./components/SuperAdmin/ImpersonateUser.react.jsx');
var Collapse = require('./components/Collapse.react.jsx');
//<Route path="createDSL" component={EditDSL} />
            //<Route path="editDSL" component={EditDSL} />
            
var Routes = React.createClass({
  render: function() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MaaSApp}>
          <IndexRoute component={Home} />
          <Route path="login" component={Login} />
          <Route path="register" component={Register} />
          <Route path="recoverpwd" component={ChangePassword} />
          <Route path="resetpwd" component={ResetPwd} />
          <Route path="profile" component={Profile}>
            <Route path="changeAvatar" component={ChangeAvatar} />
            <Route path="personalData" component={PersonalData} />
            <Route path="changePassword" component={ChangePassword} />
            <Route path="deleteAccount" component={DeleteAccount} />
            <Redirect from="*" to="404" />
          </Route>
          <Route path="company" component={Company}>
            <Route path="externalDatabases" component={ExternalDatabases} />
            <Route path="people" component={People} />
            <Route path="deleteCompany" component={DeleteCompany} />
          </Route>
          <Route path="manageDSL" component={ManageDSL}>
            <Route path="manageDSLSource" component={ManageDSLSource} />
            <Route path="manageDSLSource/:definitionId" component={ManageDSLSource} />
          </Route>
          <Route path="editor" component={Editor} />
          <Route path="editorConfig" component={EditorConfig} />
          <Route path="collapse" component={Collapse} />
          <Route path="manageActiveDashboard" component={ManageActiveDashboard} />
          <Route path="dashboardSuperAdmin" component={DashboardSuperAdmin}>
            <Route path="databaseManagement" component={DatabaseManagement} />
            <Route path="impersonateUser" component={ImpersonateUser} />
            <Route path="companiesManagement" component={CompaniesManagement} />
            <Route path="usersManagement" component={UsersManagement} />
          </Route>
          <Route path="404" component={Error404} />
          <Redirect from="*" to="404" />
        </Route>
      </Router>
      );
  }
});

module.exports = Routes;