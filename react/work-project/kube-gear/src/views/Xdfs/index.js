import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Route } from 'react-router-dom';
import Xdfspage from './Pages/Xdfs'
import XdfsDetail from './Pages/XdfsDetail'

export default function XdfsRoute () {
  return (
    <Stack
      styles={{ root: { position: 'relative', padding: '0 20px 20px' } }}
      verticalFill
    >
      <Route
        exact
        path="/xdfs"
        render={matchProps => (
          <Xdfspage {...matchProps} />
        )}
      />
      <Route
        path="/xdfs/:path"
        render={matchProps => (
          <XdfsDetail {...matchProps} />
        )}
      />
    </Stack>
  )
}