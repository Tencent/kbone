/**
 * 废弃
 */
function useGlobal() {
    // 此接口的实现存在内存泄露，建议走如下逻辑：
    // 1、页面退出/隐藏时清算 global，确保 global 没有当前页面的引用（必要时可使用深拷贝）
    // 2、页面进入时使用纯净的 global
}

module.exports = {
    useGlobal,
}
