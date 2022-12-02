import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';

import { RouteWithLayout, Loading } from './components';
import { Minimal as MinimalLayout, Main as MainLayout } from './layouts';

import { useSelector } from 'react-redux';
import { selectIs401error } from 'layouts/Main/features/userinfo/userinfoSlice';

const SignIn = lazy(async() => await import(/* webpackChunkName: "SignIn" */ './views/SignIn'))
const SignUp = lazy(async () => await import(/* webpackChunkName: 'SignUp' */ './views/SignUp'))
const ForgetPassword = lazy(async() => await import(/* webpackChunkName: "ForgetPassword" */ './views/ForgetPassword'))
const ChangePassword = lazy(async() => await import(/* webpackChunkName: "ChangePassword" */ './views/ChangePassword'))
const Entry = lazy(async () => await import(/* webpackChunkName: 'Entry' */ './views/Entry'))
const Hardware = lazy(async () => await import(/* webpackChunkName: 'Hardware' */ './views/Hardware'))
const JobSubmit = lazy(async() => await import(/* webpackChunkName: 'JobSubmit' */ './views/JobSubmit'))
const JobDetail = lazy(async() => await import(/* webpackChunkName: 'JobDetail' */ './views/JobDetail'))
const LicenseList = lazy(async() => await  import(/* webpackChunkName: 'LicenseList' */ './views/LicenseList'))
const NFSDiskList = lazy(async() => await import(/* webpackChunkName: 'NFSDiskList' */ './views/NFSDiskList'))
const Repository = lazy(async() => await import(/* webpackChunkName: 'Repository' */ './views/Repository'))
const RoleList = lazy(async() => await import(/* webpackChunkName: 'RoleList' */ './views/RoleList'))
const FsItemList = lazy(async() => await import(/* webpackChunkName: 'FsItemList' */ './views/FsItemList'))
const Todo = lazy(async() => await import(/* webpackChunkName: 'Todo' */ './views/Todo'))
const Term = lazy(async() => await import(/* webpackChunkName: 'Todo' */ './views/Term'))
const UserInfo = lazy(async() => await import(/* webpackChunkName: 'UserInfo' */ './views/UserInfo'))
const UserManage = lazy(async() => await import(/* webpackChunkName: 'UserManage' */ './views/UserManage'))
const VirtualGroup = lazy(async() => await import(/* webpackChunkName: 'VirtualGroup' */ './views/VirtualGroup'))
const SystemSetting = lazy(async() => await import(/* webpackChunkName: 'SystemSetting' */ './views/SystemSetting'))
const GlusterFS = lazy(async() => await import(/* webpackChunkName: 'GlusterFS' */ './views/GlusterFS'))
const LoginLog = lazy(async() => await import(/* webpackChunkName: 'LoginLog' */ './views/LoginLog'))
const ClusterReport = lazy(async() => await import(/* webpackChunkName: 'ClusterReport' */ './views/ClusterReport'))
const ResourceManage = lazy(async() => await import(/* webpackChunkName: 'ResourceManage' */ './views/ResourceManage'))
const DataLabeling = lazy(async() => await import(/* webpackChunkName: 'DataLabeling' */ './views/DataLebeling'))
const GroupManage = lazy(async() => await import(/* webpackChunkName: 'GroupManage' */ './views/GroupManage'))
const Calendar = lazy(async() => await import(/* webpackChunkName: 'Calendar' */ './views/Calendar'))
const Schedule = lazy(async() => await import(/* webpackChunkName: 'Schedule' */ './views/Schedule'))
const ManageSchedule = lazy(async() => await import(/* webpackChunkName: 'ManageSchedule' */ './views/ManageSchedule'))
const ManageTemplate = lazy(async() => await import(/* webpackChunkName: 'ManageTemplate' */ './views/ManageTemplate'))
const ManageReserve = lazy(async() => await import(/* webpackChunkName: 'ManageReserve' */ './views/ManageReserve'))
const VersionLog = lazy(async() => await import(/* webpackChunkName: 'VersionLog' */ './views/VersionLog'))
const NotFound = lazy(async() => await import(/* webpackChunkName: 'NotFound' */ './views/NotFound'))

const Routes = () => {
  const history = useHistory();
  const is401error = useSelector(selectIs401error);

  useEffect(() => {
    if (is401error) {
      history.push('/');
    }
  }, [is401error])

  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <RouteWithLayout
          component={SignIn}
          exact
          layout={MinimalLayout}
          path="/"
        />
        <RouteWithLayout
          component={SignUp}
          exact
          layout={MinimalLayout}
          path="/sign-up"
        />
        <RouteWithLayout
          component={ForgetPassword}
          exact
          layout={MinimalLayout}
          path="/forget-password"
        />
        <RouteWithLayout
          component={ChangePassword}
          exact
          layout={MinimalLayout}
          path="/changePassword"
        />
        <RouteWithLayout
          auth
          component={Entry}
          exact
          layout={MainLayout}
          path="/entry"
        />
        <RouteWithLayout
          auth
          component={Hardware}
          layout={MainLayout}
          path="/cluster-view/hardware"
        />
        <RouteWithLayout
          auth
          component={JobSubmit}
          exact
          layout={MainLayout}
          path="/job-submit"
        />
        <RouteWithLayout
          auth
          component={JobDetail}
          layout={MainLayout}
          path="/job-detail"
        />
        <RouteWithLayout
          auth
          component={LicenseList}
          exact
          layout={MainLayout}
          path="/license-list"
        />
        <RouteWithLayout
          auth
          component={NFSDiskList}
          layout={MainLayout}
          path="/nfs-disk-list"
        />
        <RouteWithLayout
          auth
          component={FsItemList}
          layout={MainLayout}
          path="/fs-item-list"
        />
        <RouteWithLayout
          auth
          component={FsItemList}
          layout={MainLayout}
          path="/glusterfs-item-list"
        />
        <RouteWithLayout
          auth
          component={Repository}
          layout={MainLayout}
          path="/repository"
        />
        <RouteWithLayout
          auth
          component={RoleList}
          exact
          layout={MainLayout}
          path="/role-list"
        />
        <RouteWithLayout
          auth
          component={Todo}
          exact
          layout={MainLayout}
          path="/todo"
        />
        <RouteWithLayout
          auth
          component={UserManage}
          exact
          layout={MainLayout}
          path="/user-manage"
        />
        <RouteWithLayout
          auth
          component={UserInfo}
          exact
          layout={MainLayout}
          path="/user-info"
        />
        <RouteWithLayout
          auth
          component={VirtualGroup}
          exact
          layout={MainLayout}
          path="/virtual-groups"
        />
        <RouteWithLayout
          auth
          component={SystemSetting}
          exact
          layout={MainLayout}
          path="/system-setting"
        />
        <RouteWithLayout
          auth
          component={LoginLog}
          exact
          layout={MainLayout}
          path="/loginlog"
        />
        <RouteWithLayout
          auth
          component={GlusterFS}
          layout={MainLayout}
          path="/glusterfs"
        />
        <RouteWithLayout
          auth
          component={ClusterReport}
          layout={MainLayout}
          path="/cluster-report"
        />
        <RouteWithLayout
          auth
          component={ResourceManage}
          layout={MainLayout}
          path="/resource-manage"
        />
        <RouteWithLayout
          auth
          component={DataLabeling}
          layout={MainLayout}
          path="/data-labeling"
        />
        <RouteWithLayout
          auth
          component={GroupManage}
          layout={MainLayout}
          path="/group-manage"
        />
        <RouteWithLayout
          auth
          component={Calendar}
          layout={MainLayout}
          path="/calendar-manage"
        />
        <RouteWithLayout
          auth
          component={Schedule}
          layout={MainLayout}
          path="/schedule"
        />
        <RouteWithLayout
          auth
          component={ManageSchedule}
          layout={MainLayout}
          path="/schedule-manage"
        />
        <RouteWithLayout
          auth
          component={ManageTemplate}
          layout={MainLayout}
          path="/template-manage"
        />
        <RouteWithLayout
          auth
          component={ManageReserve}
          layout={MainLayout}
          path="/queue-manage"
        />
        <RouteWithLayout
          auth
          component={VersionLog}
          layout={MainLayout}
          path="/version-log"
        />
        <RouteWithLayout
          component={NotFound}
          exact
          layout={MinimalLayout}
          path="/not-found"
        />
        <Route
          component={Term}
          exact
          path="/term"
        />
        <Redirect to="/entry" />
      </Switch>
    </Suspense>
  );
};

export default Routes;
