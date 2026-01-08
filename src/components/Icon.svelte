<script lang="ts">
    let {
        iconName,
        className,
    }: { iconName: string; className: string | undefined } = $props();
</script>

<svg class="icon {className}">
    <use xlink:href={`/assets/icons.svg#${iconName}`}></use>
</svg>

<style>
    svg {
        width: 1em;
        height: 1em;
        vertical-align: -0.125em;
    }
</style>
