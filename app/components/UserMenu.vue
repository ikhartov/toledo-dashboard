<script lang="ts">
interface UserMenuProps {
  collapsed?: boolean
}
</script>

<script setup lang="ts">
defineProps<UserMenuProps>()

const { ui } = useAppConfig()
const { user } = useCurrentUser()
const { userNavigation } = storeToRefs(useNavigationStore())
</script>

<template>
  <UDropdownMenu
    :items="userNavigation"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        avatar: {
          src: user?.avatar,
          alt: user?.name || '',
        },
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : ui.icons.chevronsUpDown
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
          class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
