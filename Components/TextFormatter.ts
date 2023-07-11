import React from 'react'

const Ucword = (text:string) => {
    return text.replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    })
}
export {Ucword}