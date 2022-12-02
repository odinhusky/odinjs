import React, { useEffect } from 'react';

import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import io from 'socket.io-client';

import cookies from 'js-cookie';
import { debounce } from 'lodash';

const Term = () => {
  useEffect(() => {
    document.title = 'Web SSH';
    const token = cookies.get('token');

    if (!token) location.href = '/'
    var socket;
    (function initTerm() {
      var terminalContainer = document.getElementById('terminal-container');
      var term = new Terminal({
        cursorBlink: true,
        scrollback: 80,
        convertEol: true // Enabled => the cursor stays at the beginning of the next line
      });
      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);
      term.open(terminalContainer, {
        focus: true
      });

      fitAddon.fit();
      // Init socket
      // - Websocket
      // - Mannual connection
      const { restServerUri } = window.ENV;
      const urlParams = new URLSearchParams(window.location.search);
      const httpPatterm = /^((http|https):\/\/)/;

      // check restServer has http or not
      // if true, change default path
      const url = httpPatterm.test(restServerUri) ? restServerUri : '/';
      socket = io(url, {
        transports: ['websocket'],
        autoConnect: false,
        query: {
          Authorization: `Bearer ${cookies.get('token')}`,
          user: urlParams.get('user'),
          job: urlParams.get('job'),
          taskRole: urlParams.get('taskRole'),
          taskRoleIndex: urlParams.get('taskRoleIndex'),
          rows: term.rows,
          cols: term.cols
        }
      })

      // On reconnection, reset the transports option, as the Websocket
      // connection may have failed (caused by proxy, firewall, browser, ...)
      socket.on('reconnect_attempt', function() {
        socket.io.opts.transports = ['polling', 'websocket'];
      });

      // Ref: https://github.com/socketio/socket.io-client/blob/master/docs/API.md#event-connect
      socket.on('connect', function() {
        // term.resize(70, 30); // TODO XXX rwd?
        // eslint-disable-next-line no-useless-escape
        term.write('\r\Connected to backend\r\n');

        // Browser -> Backend
        term.onData(function(data) {
          socket.emit('data', data);
        });

        // term.textarea.onpaste = (e) => {
        //   const text = e.clipboardData.getData('text')
        //   if (text) socket.emit('data', text.replace(/\n/g, ''));
        // }

        // Backend -> Browser
        socket.on('data', function(data) {
          term.write(data);
        });

        socket.on('disconnect', function() {
          socket.close();
        });
      });

      function resizeEvent() {
        fitAddon.fit();
        socket.emit('resize', { cols: term.cols, rows: term.rows });
      }

      window.addEventListener('resize', debounce(resizeEvent, 100));

      // Open socket!
      socket.open();
    })()

    window.addEventListener('beforeunload', function (e) {
      // Cancel the event
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = ' ';
    });


    window.addEventListener('unload', function () {
      // 斷開魂結!
      socket.close();
    })

  }, [])
  return (
    <div
      id="terminal-container"
      style={{
        height: '100vh',
        background: '#000'
      }}
    />
  );
};

export default Term;
