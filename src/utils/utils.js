import product_data from "@/data/product-data";
// Get max price
export function maxPrice() {
    const max_price = [...product_data].reduce((max, product) => {
        return product.price > max ? product.price : max;
    }, 0);
    return max_price;
}
;
export function imageCompare() {
    document.addEventListener('DOMContentLoaded', () => {
        // Check if there are elements with the class 'beforeAfter'
        const beforeAfterElements = document.querySelectorAll('.beforeAfter');
        if (beforeAfterElements.length > 0) {
            beforeAfterElements.forEach((element) => {
                beforeAfter(element, {
                    movable: true,
                    clickMove: true,
                    position: 50,
                    separatorColor: '#fafafa',
                    bulletColor: '#fafafa',
                    onMoveStart: (e) => {
                        // your code here
                    },
                    onMoving: () => {
                        // your code here
                    },
                    onMoveEnd: () => {
                        // your code here
                    },
                });
            });
        }
    });
    // Example beforeAfter function definition for illustration purposes
    function beforeAfter(element, options) {
        // Initialize your beforeAfter plugin on the element with the provided options
        // This is where you would implement your beforeAfter functionality
    }
}
