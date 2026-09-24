<!-- KTeleportHub.vue — central teleport target inside .k-ui so teleported
     content inherits every --k-* CSS variable and the theme data-attribute.

     Usage in other components:
       <Teleport to="#k-teleport-hub">
         …
       </Teleport>
-->
<template>
    <!-- No aria-hidden here: teleported modals/dropdowns/toasts land *inside*
         this element, and aria-hidden on an ancestor hides them from assistive
         tech (Chrome also blocks it and logs "Blocked aria-hidden on an element
         because its descendant retained focus"). The hub is inert by itself —
         it is pointer-events:none and empty until something teleports in — so
         it needs no ARIA at all. -->
    <div id="k-teleport-hub" class="k-teleport-hub" />
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
