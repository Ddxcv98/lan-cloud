<script lang="ts">
  export let message: string;
  export let color = 'red';
  export let onAnimationEnd: () => void;
</script>

<div
  class="alert"
  style="background-color: {color}"
  on:animationend={onAnimationEnd}
>
  {message}
</div>

<style>
  .alert {
    position: absolute;
    display: flex;
    justify-content: center;
    right: 50%;
    transform: translate(50%, -100%);
    padding: 0.75em;
    border-radius: 5px;
    color: black;
    animation: slide-in-out 3s ease-in-out;
  }

  @keyframes slide-in-out {
    0% {
      transform: translate(50%, -100%);
    }

    25% {
      transform: translate(50%, 0%);
    }

    75% {
      transform: translate(50%, 0%);
    }

    100% {
      transform: translate(50%, -100%);
    }
  }
</style>
