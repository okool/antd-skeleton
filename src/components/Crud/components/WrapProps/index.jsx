import React, { Component, cloneElement } from 'react'


const WrapProps = (WrapComponent, extProps) => {
    return class extends Component {
        render() {
            const AC = cloneElement(WrapComponent, extProps)
            return AC
        }
    }
}

export default WrapProps