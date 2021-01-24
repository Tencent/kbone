import Validator from './validator'

const toString = Object.prototype.toString

function diff(old, newVal) {
    if ((!old && newVal) || (old && !newVal)) return true
    for (const k in newVal) {
        if (old[k] !== newVal[k]) return true
    }
    for (const k in old) {
        if (old[k] !== newVal[k]) return true
    }
    return false
}
function validateSingleRule(rule, value, param = null, models = null) {
    let message = ''
    const ruleKeys = Object.keys(rule)

    for (let i = 0, l = ruleKeys.length; i < l; ++i) {
        const ruleKey = ruleKeys[i]
        if (ruleKey === 'name' || ruleKey === 'message') continue

        const validateMethod = typeof rule.validator !== 'undefined' ? rule.validator : Validator[ruleKey]
        if (typeof validateMethod === 'function') {
            message = validateMethod(rule, value, param, models)
            if (message) return message
        }
    }
    return message
}
class FormValidator {
    constructor(models, rules) {
        this.models = models || {}
        this.rules = rules || {}
        this.errors = {}
    }

    validate(cb) {
        return new Promise(resolve => {
            let failCount = 0
            const errors = this.errors
            const models = this.models
            Object.keys(this.rules).forEach((fieldName) => {
                const oldError = errors[fieldName]
                this._innerValidateField(fieldName, models[fieldName], (valid, newError) => {
                    if (!valid) failCount++
                    if (diff(oldError, newError)) {
                        errors[fieldName] = newError
                    }
                })
            })
            const keys = Object.keys(errors)
            keys.forEach((key) => {
                if (!errors[key]) delete errors[key]
            })
            // 先支持同步的接口吧
            resolve({isValid: !failCount, errors: failCount ? errors : undefined})
            if (cb) cb(!failCount, failCount ? errors : undefined)
        })
    }

    validateField(name, value, cb) {
        return new Promise(resolve => {
            this._innerValidateField(name, value, (valid, error) => {
                const errObj = {}
                errObj[name] = error
                resolve({valid, error: valid ? undefined : error})
                if (cb) cb(valid, valid ? undefined : errObj)
                const oldError = this.errors[name]
                const errorChanged = diff(oldError, error)
                if (errorChanged) {
                    if (!error) delete this.errors[name]
                    this.errors[name] = error
                }
            })
        })
    }

    _innerValidateField(name, value, cb) {
        const rules = this.rules[name]
        if (!rules) {
            console.warn(`[form-validator] rule name ${name} not exists.`)
            cb(true)
            return
        }
        // 处理参数
        if (typeof value === 'function') {
            cb = value
            value = undefined
        }
        let isFail = false
        const models = this.models
        if (toString.call(rules) === '[object Array]') {
            rules.forEach((rule) => {
                rule.name = name // 字段名称
                const resMessage = validateSingleRule(
                    rule,
                    value || models[name],
                    rule.param,
                    models
                )
                // 失败了直接中止
                if (resMessage && !isFail) {
                    isFail = true
                    const error = resMessage ? {message: resMessage, rule} : undefined
                    cb(false, error)
                }
            })
            // 成功的回调
            if (!isFail) {
                cb(!isFail)
            }
        } else {
            const rule = rules
            rule.name = name
            const resMessage = validateSingleRule(rule, value || models[name], rule.param, models)
            const error = resMessage ? {message: resMessage, rule} : undefined
            if (resMessage) {
                isFail = true
            }
            cb(!isFail, error)
        }
    }

    static addMethod(ruleName, method) {
        Validator[ruleName] = method
    }

    setModel(newModel) {
        this.models = newModel
    }

    setRules(newRules) {
        this.rules = newRules
    }
}

export default FormValidator
