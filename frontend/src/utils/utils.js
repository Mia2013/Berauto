export const formatPrice = (price) => {
    return new Intl.NumberFormat('hu-HU', {
        useGrouping: true,
        minimumIntegerDigits: 1
    }).format(price);
};