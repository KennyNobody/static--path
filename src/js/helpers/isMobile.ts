const MAX_WIDTH_VALUE = 1299;
const isMobile = (maxWidth?: number): boolean => {
    return window.innerWidth <= (maxWidth ?? MAX_WIDTH_VALUE);
};

export {
    isMobile,
};
