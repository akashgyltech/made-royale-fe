import { useEffect, useRef, useState } from "react";
export default function CounterItem({ min, max }) {
    const [counted, setCounted] = useState(min);
    const targetElement = useRef(null); // Add type annotation for useRef
    const startCountup = () => {
        const intervalId = setInterval(() => {
            setCounted((pre) => {
                const tempCount = pre + Math.ceil(max / 20);
                if (tempCount >= max) {
                    clearInterval(intervalId);
                    return max;
                }
                else {
                    return tempCount;
                }
            });
        }, 70);
    };
    useEffect(() => {
        function handleIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setCounted(min);
                    startCountup();
                }
            });
        }
        // Options for the Intersection Observer
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };
        // Create an Intersection Observer and pass in the callback function and options
        const observer = new IntersectionObserver(handleIntersection, options);
        // Start observing the target element
        if (targetElement.current) {
            observer.observe(targetElement.current);
        }
        return () => {
            setCounted(min);
            observer.disconnect(); // Disconnect the observer when component unmounts
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <i ref={targetElement}>{counted}</i>;
}
