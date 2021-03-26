<script lang="ts">
  import { io } from 'socket.io-client';
  import { onMount } from 'svelte';

  import { SERVER } from './env';

  import Alert from './Alert.svelte';
  import Dropzone from './Dropzone.svelte';

  let files: { name: string; size: string }[] = [];
  let alert: { message: string; color: string };

  async function dropHandler(files: File[]) {
    try {
      const form = new FormData();

      for (const file of files) {
        form.append('files', file);
      }

      const res = await fetch(`${SERVER}/files`, {
        method: 'POST',
        body: form
      });

      if (!res.ok) {
        alert = {
          message: `Error ${res.status}: ${res.statusText}`,
          color: 'red'
        };
      }
    } catch (err) {
      alert = { message: err.message, color: 'red' };
    }
  }

  async function deleteHandler(file: string) {
    try {
      const res = await fetch(`${SERVER}/files/${file}`, { method: 'DELETE' });

      if (!res.ok) {
        alert = {
          message: `Error ${res.status}: ${res.statusText}`,
          color: 'red'
        };
      }
    } catch (err) {
      alert = { message: err.message, color: 'red' };
    }
  }

  function setupSocket() {
    const socket = io(SERVER);
    let haveBeenDown = false;

    socket.on('connect', () => {
      if (haveBeenDown) {
        haveBeenDown = false;
        alert = { message: 'Back online!', color: 'green' };
      }
    });

    socket.on('files', data => (files = data));

    socket.on('post', data => {
      files.push(...data);
      files.sort((a, b) => a.name.localeCompare(b.name));
      files = files;
    });

    socket.on('delete', data => {
      const index = files.findIndex(file => file.name == data);
      files.splice(index, 1);
      files = files;
    });

    socket.on('error', err => (alert = { message: err, color: 'red' }));

    socket.on('disconnect', () => {
      haveBeenDown = true;
      alert = { message: 'Lost connection to the server.', color: 'red' };
    });

    setTimeout(() => {
      if (!socket.connected) {
        haveBeenDown = true;

        alert = {
          message: 'It seems like a connection could not established...',
          color: 'red'
        };
      }
    }, 3000);
  }

  onMount(() => setupSocket());
</script>

<div class="app">
  {#if alert}
    <Alert
      message={alert.message}
      color={alert.color}
      onAnimationEnd={() => (alert = null)}
    />
  {/if}
  <Dropzone onDrop={dropHandler} />
  <div class="grid">
    {#each files as file}
      <span class="name">{file.name}</span>
      <span class="file-size">{file.size}</span>
      <img
        src="images/download.png"
        alt="download"
        on:mouseup={() => window.open(`${SERVER}/files/${file.name}`)}
      />
      <img
        src="images/delete.png"
        alt="delete"
        on:mouseup={() => deleteHandler(file.name)}
      />
    {/each}
  </div>
</div>

<style>
  .app {
    margin: 8px;
  }

  .app > :global(*) {
    margin-bottom: 1em;
  }

  .grid {
    display: grid;
    align-items: center;
    grid-template-columns: auto auto min-content min-content;
    gap: 0.5em;
  }

  .grid > img {
    width: 2em;
    cursor: pointer;
  }

  .name {
    overflow: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    white-space: nowrap;
  }
</style>
