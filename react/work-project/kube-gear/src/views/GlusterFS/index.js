import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Route } from 'react-router-dom';
import GlusterFSpage from './Pages/GlusterFS'
import GlusterFSdetail from './Pages/GlusterFSdetail'

export default function GlusterFSRoute () {
  return (
    <>
      <Stack
        styles={{ root: { position: 'relative', padding: '0 20px 20px' } }}
        verticalFill
      >
        <Route
          exact
          path="/glusterfs"
          render={matchProps => (
            <GlusterFSpage {...matchProps} />
          )}
        />
        <Route
          path="/glusterfs/:path"
          render={matchProps => (
            <GlusterFSdetail {...matchProps} />
          )}
        />
      </Stack>
    </>
  )
}