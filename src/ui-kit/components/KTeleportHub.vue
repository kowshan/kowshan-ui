<!-- KTeleportHub.vue — central teleport target inside .k-ui so teleported
     content inherits every --k-* CSS variable and the theme data-attribute.

     Usage in other components:
       <Teleport to="#k-teleport-hub">
         …
       </Teleport>
-->
<template>
    <div id="k-teleport-hub" class="k-teleport-hub" aria-hidden="true" />
</template>

<style>
.k-teleport-hub {
    position: fixed;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
}
.k-teleport-hub > * {
    pointer-events: auto;
}
</style>
