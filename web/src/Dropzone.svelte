<script lang="ts">
  export let onDrop: (files: File[]) => void;

  let dropzone: HTMLLabelElement;

  function dragEnterHandler(e: DragEvent) {
    if (e.dataTransfer.items[0]?.kind == 'file') {
      dropzone.style.borderColor = 'green';
    } else {
      dropzone.style.borderColor = 'red';
    }
  }

  function dragLeaveHandler() {
    dropzone.style.borderColor = 'initial';
  }

  function dragOverHandler(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function dropHandler(e: DragEvent) {
    e.preventDefault();
    dragLeaveHandler();
    if (e.dataTransfer.items[0].kind != 'file') return;

    const files = Array.from(e.dataTransfer.items).map(item =>
      item.getAsFile()
    );

    onDrop(files);
  }
</script>

<div>
  <input
    id="file"
    class="input"
    type="file"
    multiple
    on:change={e => onDrop(Array.from(e.currentTarget.files))}
  />
  <label
    class="dropzone"
    for="file"
    bind:this={dropzone}
    on:dragenter={dragEnterHandler}
    on:dragover={dragOverHandler}
    on:dragleave={dragLeaveHandler}
    on:drop={dropHandler}
  >
    Drop files to upload
  </label>
</div>

<style>
  .input {
    display: none;
  }

  .dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 6em;
    color: gray;
    background-color: #eaeaea;
    border-radius: 5px;
    border-style: dashed;
    border-width: 2px;
  }
</style>
