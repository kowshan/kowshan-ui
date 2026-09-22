// utils/tree.ts — shared tree helpers for file/folder components

export interface TreeNode {
    id: string
    name: string
    isFolder?: boolean
    children?: TreeNode[]
    [key: string]: any
}

export const findNode = (items: TreeNode[], id: string): TreeNode | null => {
    for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
            const found = findNode(item.children, id)
            if (found) return found
        }
    }
    return null
}

export const removeNode = (items: TreeNode[], id: string): boolean => {
    const idx = items.findIndex(i => i.id === id)
    if (idx !== -1) { items.splice(idx, 1); return true }
    for (const item of items) {
        if (item.children && removeNode(item.children, id)) return true
    }
    return false
}

export const flattenFiles = (items: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = []
    for (const item of items) {
        if (item.children) result.push(...flattenFiles(item.children))
        else result.push(item)
    }
    return result
}

/** 1-based depth of a node (root-level children = 1), 0 if not found */
export const nodeDepth = (items: TreeNode[], id: string): number => {
    for (const item of items) {
        if (item.id === id) return 1
        if (item.children) {
            const d = nodeDepth(item.children, id)
            if (d) return d + 1
        }
    }
    return 0
}

export const uid = (prefix = 'kn') =>
    `${prefix}-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`
