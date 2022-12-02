import React, { useEffect, useRef } from "react"

interface RenderCounterProps {
    name: string
    debug: boolean
}

const RenderCounter = (props: RenderCounterProps) => {
    const counter = useRef(0)
    const { name, debug } = props
    const archiveNumber = 50

    useEffect(()=>{
        console.log(`-----------------------mount ${name}-----------------------`)

        return () => {
            console.log(`----------------------unmount ${name}----------------------`)
        }
    },[])

    useEffect(()=>{
        counter.current = counter.current + 1
        if ( counter.current%archiveNumber===0 || debug){
            console.log(`re-render ${name} ${counter.current} times.`)
        }
    })

    return <></>
}

export default RenderCounter