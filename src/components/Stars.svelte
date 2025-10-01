<script lang="ts">
  import Icon from "./Icon.svelte";

  interface Props {
    /** Float rating on 5 */
    rating: number;
  }

  let { rating }: Props = $props();
  // Example: 4.6 should show full 4th star
  const shouldShowFullStar = (starNum: number) => starNum <= rating;
  const shouldShowFractionalStar = (starNum: number) =>
    !Number.isInteger(rating) && Math.ceil(rating) === starNum;
  const flooredRating = Math.floor(rating);
  const fraction = rating - flooredRating;
  const fractionPerc = fraction * 100;
  // To identify the background style that a star with this fractional rating should get.
  const fractionID = `r_${flooredRating}_${Math.floor(fractionPerc)}`;
  const stars = Array(5).fill("");
</script>

<div class="stars">
  {#each stars as _, i}
    <Icon
      iconName="star-{shouldShowFullStar(i + 1) ||
      shouldShowFractionalStar(i + 1)
        ? 'solid'
        : 'regular'}"
      className="yellow {shouldShowFractionalStar(i + 1)
        ? `fractional ${fractionID}`
        : ''}"
    />
    {#if shouldShowFractionalStar(i + 1)}
      {@html `
          <style>
          .${fractionID}.fractional::before {
              background: linear-gradient(
                0.25turn,
                #ffc611 ${fractionPerc}%,
                rgb(185 185 185 / 36%) ${fractionPerc + 0.1}%);
          }
          </style>`}
    {/if}
  {/each}
</div>

<style lang="scss">
  .stars :global(.yellow.fractional::before) {
    background-clip: text;
    -webkit-background-clip: text;
    fill: transparent;
  }

  .stars :global(.yellow) {
    fill: yellow;
  }
</style>
